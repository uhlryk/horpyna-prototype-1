
import Dispatcher = require("./dispatcher/Dispatcher");
import ComponentManager = require("./component/ComponentManager");
import DbManager = require("./dbManager/DbManager");
import Module = require("./component/routeComponent/module/Module");
import Model = require("./component/routeComponent/module/model/Model");
class FrontController {
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static COMPONENT_MANAGER_NONE: string = "Need 'ComponentManager'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";

	private dispatcher: Dispatcher;
	private componentManager: ComponentManager;
	private dbManager: DbManager;
	constructor() {
	}
	public setDispatcher(dispatcher: Dispatcher):void{
		this.dispatcher = dispatcher;
	}
	public setComponentManager(moduleManager:ComponentManager):void{
		this.componentManager = moduleManager;
	}
	public setDbManager(dbManager:DbManager):void{
		this.dbManager = dbManager;
	}
	private setup():void{
		if(this.dispatcher == undefined){
			throw new Error(FrontController.DISPATCHER_NONE);
		}
		if(this.componentManager == undefined){
			throw new Error(FrontController.COMPONENT_MANAGER_NONE);
		}
		if(this.dbManager == undefined){
			throw new Error(FrontController.DB_MANAGER_NONE);
		}
	}
	private setConnectionToModels(){
		var moduleList:Module[] =this.componentManager.getModuleList();
		for(var moduleIndex in moduleList){
			var module:Module = moduleList[moduleIndex];
			var modelList:Model[] = module.getModelList();
			for(var modelIndex in modelList){
				var model:Model = modelList[modelIndex];
				if(model.isConnection() === false) {
					var modelConnectionName = model.getConnectionName();
					if(modelConnectionName){
						model.setConnection(this.dbManager.getConnection("modelConnectionName"));
					} else {
						model.setConnection(this.dbManager.getConnection());//zwraca domyślne bo nie podaliśmy nazwy
					}
				}
				model.prepare();

			};
		};
	}
	public init():Promise<any>{
		this.setup();
		this.dbManager.init();
		this.componentManager.initModules();
		this.setConnectionToModels();
		var promise = this.dbManager.build();
		this.dispatcher.createRoutes(this.componentManager.getModuleList(), this.componentManager.getDefaultModule());
		return promise;
	}
}
export = FrontController;