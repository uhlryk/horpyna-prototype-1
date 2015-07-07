
import Dispatcher = require("./dispatcher/Dispatcher");
import ModuleManager = require("./moduleManager/ModuleManager");
import DbManager = require("./dbManager/DbManager");
import Module = require("./component/routeComponent/module/Module");
import Model = require("./component/routeComponent/module/model/Model");
class FrontController {
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static MODULE_MANAGER_NONE: string = "Need 'moduleManager'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";

	private dispatcher: Dispatcher;
	private moduleManager: ModuleManager;
	private dbManager: DbManager;
	constructor() {
	}
	public setDispatcher(dispatcher: Dispatcher):void{
		this.dispatcher = dispatcher;
	}
	public setModuleManager(moduleManager:ModuleManager):void{
		this.moduleManager = moduleManager;
	}
	public getModuleManager():ModuleManager{
		return this.moduleManager;
	}
	public setDbManager(dbManager:DbManager):void{
		this.dbManager = dbManager;
	}
	public getDbManager():DbManager{
		return this.dbManager;
	}
	private setup():void{
		if(this.dispatcher == undefined){
			throw new Error(FrontController.DISPATCHER_NONE);
		}
		if(this.moduleManager == undefined){
			throw new Error(FrontController.MODULE_MANAGER_NONE);
		}
		if(this.dbManager == undefined){
			throw new Error(FrontController.DB_MANAGER_NONE);
		}
	}
	private setConnectionToModels(){
		var moduleList:Module[] =this.moduleManager.getModuleList();
		for(var moduleIndex in moduleList){
			var module:Module = moduleList[moduleIndex];
			var modelList:Model[] = module.getModelList();
			for(var modelIndex in modelList){
				var model:Model = modelList[modelIndex];
				model.setConnection(this.dbManager.getConnection());
				model.prepare();

			};
		};
	}
	public run():void{
		this.setup();
		this.dbManager.init();
		this.moduleManager.initModules();
		this.setConnectionToModels();
		this.dbManager.build();
		this.dispatcher.createRoutes(this.moduleManager.getModuleList());
	}
}
export = FrontController;