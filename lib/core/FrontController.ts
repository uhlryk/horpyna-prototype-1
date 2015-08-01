import Element = require("./Element");
import Dispatcher = require("./dispatcher/Dispatcher");
import ComponentManager = require("./component/ComponentManager");
import DbManager = require("./dbManager/DbManager");
import Module = require("./component/routeComponent/module/Module");
import SystemModule = require("./component/routeComponent/module/SystemModule");
import Model = require("./component/routeComponent/module/model/Model");
import Util = require("./util/Util");
import ViewManager = require("./view/ViewManager");
class FrontController extends Element {
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static COMPONENT_MANAGER_NONE: string = "Need 'ComponentManager'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";
	private _dispatcher: Dispatcher;
	private _componentManager: ComponentManager;
	private _dbManager: DbManager;
	private _viewManager: ViewManager;
	constructor() {
		super();
		this.initDebug("core");
		this.debug("front:constructor:");
	}
	public set dispatcher(v: Dispatcher){
		this._dispatcher = v;
	}
	public get dispatcher() : Dispatcher {
		return this._dispatcher;
	}
	public set componentManager(v:ComponentManager){
		this._componentManager = v;
	}
	public get componentManager(): ComponentManager {
		return this._componentManager;
	}
	public set dbManager(v:DbManager){
		this._dbManager = v;
	}
	public get dbManager(): DbManager {
		return this._dbManager;
	}
	public set viewManager(v:ViewManager){
		this._viewManager = v;
	}
	public get viewManager(): ViewManager {
		return this._viewManager;
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

		this.dispatcher.viewManager = this.viewManager;
		this.dispatcher.init();
		this.debug("front:dbManager.init()");
		this.dbManager.init();
		this.debug("front:componentManager.init()");
		return this.componentManager.init();
	}
}
export = FrontController;