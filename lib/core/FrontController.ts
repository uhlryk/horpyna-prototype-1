import Dispatcher = require("./dispatcher/Dispatcher");
import ComponentManager = require("./component/ComponentManager");
import DbManager = require("./dbManager/DbManager");
import Module = require("./component/routeComponent/module/Module");
import DefaultModule = require("./component/routeComponent/module/DefaultModule");
import Model = require("./component/routeComponent/module/model/Model");
import Util = require("./util/Util");
class FrontController {
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static COMPONENT_MANAGER_NONE: string = "Need 'ComponentManager'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";
	private logger: Util.Logger;
	private dispatcher: Dispatcher;
	private componentManager: ComponentManager;
	private dbManager: DbManager;
	private debugger: Util.Debugger;
	constructor() {
		this.debugger = new Util.Debugger("core");
		this.debug("front:constructor:");
	}
	public debug(...args: any[]) {
		this.debugger.debug(args);
	}
	public setLogger(logger:Util.Logger){
		this.logger = logger;
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
	// private setConnectionToModels(){
	// 	var moduleList:Module[] =this.componentManager.getModuleList();
	// 	for(var moduleIndex in moduleList){
	// 		var module:Module = moduleList[moduleIndex];
	// 		var modelList:Model[] = module.getModelList();
	// 		for(var modelIndex in modelList){
	// 			var model:Model = modelList[modelIndex];
	// 			if(model.isConnection() === false) {
	// 				var modelConnectionName = model.getConnectionName();
	// 				if(modelConnectionName){
	// 					model.setConnection(this.dbManager.getConnection("modelConnectionName"));
	// 				} else {
	// 					model.setConnection(this.dbManager.getConnection());//zwraca domyślne bo nie podaliśmy nazwy
	// 				}
	// 			}
	// 			model.prepare();

	// 		};
	// 	};
	// }
	public init():Promise<any>{
		this.debug("front:init:");
		this.debug("front:setup()");
		this.setup();
		this.componentManager.dispatcher = this.dispatcher;
		this.componentManager.dbManager = this.dbManager;
		this.debug("front:setDefault()");
		this.setDefault();
		this.dbManager.logger = this.logger;
		this.dispatcher.logger = this.logger;
		this.debug("front:dispatcher.createRoutes()");
		this.dispatcher.init();
		this.debug("front:dbManager.init()");
		this.dbManager.init();
		this.componentManager.logger = this.logger;
		this.debug("front:componentManager.init()");
		return this.componentManager.init();
		// .then(()=>{
		// 	this.debug("front:setConnectionToModels()");
		// 	/* X */this.setConnectionToModels();
			// this.debug("front:dbManager.build()");
			// return this.dbManager.build();

		// });
	}
	/**
	 * Ustawia akcję home, final dla dispatchera
	 */
	private setDefault():void{
		var defaultModule: DefaultModule = new DefaultModule("default");
		this.componentManager.addModule(defaultModule);
		var beginAction = defaultModule.getAction(DefaultModule.ACTION_BEGIN);
		this.dispatcher.setBeginAction(beginAction);
		var finalAction = defaultModule.getAction(DefaultModule.ACTION_FINAL);
		this.dispatcher.setFinalAction(finalAction);
		var homeAction = defaultModule.getAction(DefaultModule.ACTION_HOME);
		this.dispatcher.setHomeAction(homeAction);
		this.dispatcher.setLastError(defaultModule.errorAction);
	}
}
export = FrontController;