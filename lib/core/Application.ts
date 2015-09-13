/**
 * Jest to wyższy poziom abstrakcji frontControllera,
 * na tym poziomie może wyglądać jak wrapper tylko.
 * Ale docelowo będą interfejsy dla RouteControllera i ModuleControllera
 * i na tym poziomie będzie można je zmieniać i wstawiać do frontControllera
 */
import Bootstrap = require("./Bootstrap");
import FrontController = require("./FrontController");
import Element = require("./Element");
import Dispatcher = require("./dispatcher/Dispatcher");
import DbManager = require("./dbManager/DbManager");
import Connection = require("./dbManager/connection/Connection");
import ComponentManager = require("./component/ComponentManager");
import Component = require("./component/Component");
import Util = require("./util/Util");
import Module = require("./component/routeComponent/module/Module");
import ViewManager = require("./view/ViewManager");
class Application extends Element {
	private _frontController:FrontController;
	private _bootstrap: Bootstrap;
	constructor(router) {
		super();
		this._frontController = new FrontController();
		this._frontController.debug("application:constructor:");
		this._frontController.dispatcher = new Dispatcher(router);
		this._frontController.dbManager = new DbManager();
		this._frontController.componentManager = new ComponentManager(this._frontController.dispatcher, this._frontController.dbManager);
		this._frontController.viewManager = new ViewManager();
		this._bootstrap = new Bootstrap(this, router);
	}
	/**
	 * dpdaje nowy moduł
	 */
	// public addModule(moduleInstance: Module): Util.Promise<void> {
	// 	return this._frontController.componentManager.addModule(moduleInstance);
	// }
	/**
	 * zwraca moduł po nazwie
	 */
	public getModule(name:string):Module{
		return this._frontController.componentManager.getModule(name);
	}
	public set bootstrap(v:Bootstrap){
		this._bootstrap = v;
	}
	public get dispatcher():Dispatcher{
		return this._frontController.dispatcher;
	}
	public get frontController():FrontController{
		return this._frontController;
	}
	public get componentManager():ComponentManager{
		return this._frontController.componentManager;
	}
	public get root(): ComponentManager {
		return this._frontController.componentManager;
	}
	public get viewManager(): ViewManager {
		return this._frontController.viewManager;
	}
	public setDbDefaultConnection(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string){
		var connection = new Connection(dbType, host, port, dbName, userName, userPassword,"default");
		this._frontController.dbManager.addConnection(connection, true);
	}
	public init():Promise<any>{
		this._bootstrap.init();
		this.logger.info("Run Horpyna");
		this._frontController.debug("application:init:");
		this._frontController.debug("application:frontController.init()");
		var promise = this._frontController.init();
		return promise;
	}
}
export = Application;