import Dispatcher = require("./dispatcher/Dispatcher");

import ComponentManager = require("./component/ComponentManager");
import DbManager = require("./dbManager/DbManager");
import Module = require("./component/routeComponent/module/Module");
import SystemModule = require("./component/routeComponent/module/SystemModule");
import Model = require("./component/routeComponent/module/model/Model");
import Util = require("./util/Util");
import ViewManager = require("./view/ViewManager");
class FrontController {
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static COMPONENT_MANAGER_NONE: string = "Need 'ComponentManager'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";
	private logger: Util.Logger;
	private dispatcher: Dispatcher;
	private componentManager: ComponentManager;
	private dbManager: DbManager;
	private debugger: Util.Debugger;
	private viewManager: ViewManager;
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
	public setViewManager(viewManager:ViewManager){
		this.viewManager = viewManager;
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
	public init():Promise<any>{
		this.debug("front:init:");
		this.debug("front:setup()");
		this.setup();
		this.componentManager.dispatcher = this.dispatcher;
		this.componentManager.dbManager = this.dbManager;
		this.debug("front:set SystemModule()");
		var defaultModule: SystemModule = new SystemModule("default");
		this.componentManager.addModule(defaultModule);
		this.debug("front:set ActionBegin()");
		var beginAction = defaultModule.getAction(SystemModule.ACTION_BEGIN);
		this.dispatcher.setBeginAction(beginAction);
		this.debug("front:set ActionFinal()");
		var finalAction = defaultModule.getAction(SystemModule.ACTION_FINAL);
		this.dispatcher.setFinalAction(finalAction);
		this.debug("front:set ActionHome()");
		var homeAction = defaultModule.getAction(SystemModule.ACTION_HOME);
		this.dispatcher.setHomeAction(homeAction);

		this.dispatcher.error.logger = this.logger;
		this.dbManager.logger = this.logger;
		this.dispatcher.logger = this.logger;
		this.dispatcher.viewManager = this.viewManager;
		this.dispatcher.init();
		this.debug("front:dbManager.init()");
		this.dbManager.init();
		this.componentManager.logger = this.logger;
		this.debug("front:componentManager.init()");
		return this.componentManager.init();
	}
}
export = FrontController;