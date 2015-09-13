import Element = require("./Element");
import Dispatcher = require("./dispatcher/Dispatcher");
import ComponentManager = require("./component/ComponentManager");
import DbManager = require("./dbManager/DbManager");
import Util = require("./util/Util");
import ViewManager = require("./view/ViewManager");
class FrontController extends Element {
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
	public init():Promise<any>{
		this.debug("front:init:");
		// this.componentManager.dispatcher = this.dispatcher;
		// this.componentManager.dbManager = this.dbManager;
		this.dispatcher.viewManager = this.viewManager;
		this.dispatcher.init();
		this.debug("front:dbManager.init()");
		this.dbManager.init();
		this.debug("front:componentManager.init()");
		return this.componentManager.init();
	}
}
export = FrontController;