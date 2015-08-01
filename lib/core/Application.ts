/// <reference path="../../typings/tsd.d.ts" />
/**
 * Jest to wyższy poziom abstrakcji frontControllera,
 * na tym poziomie może wyglądać jak wrapper tylko.
 * Ale docelowo będą interfejsy dla RouteControllera i ModuleControllera
 * i na tym poziomie będzie można je zmieniać i wstawiać do frontControllera
 */
import express = require("express");
import Bootstrap = require("./Bootstrap");
import FrontController = require("./FrontController");
import Element = require("./Element");
import Dispatcher = require("./dispatcher/Dispatcher");
import DbManager = require("./dbManager/DbManager");
import Connection = require("./dbManager/connection/Connection");
import ComponentManager = require("./component/ComponentManager");
import Util = require("./util/Util");
import Module = require("./component/routeComponent/module/Module");
import ViewManager = require("./view/ViewManager");
import DispatcherError = require("./dispatcher/DispatcherError");
class Application extends Element {
	public static MODULE_PATH_NONE: string = "Need 'module path'";
	private _frontController:FrontController;
	private _dispatcher:Dispatcher;
	private _componentManager:ComponentManager;
	private _dbManager:DbManager;

	private _bootstrap: Bootstrap;
	constructor(router:express.Router) {
		super();
		this.logger = new Util.Logger();
		this._frontController = new FrontController();
		this._frontController.debug("application:constructor:");
		this._dispatcher = new Dispatcher(router);
		this._componentManager = new ComponentManager();
		this._dbManager = new DbManager();
		this._frontController.dispatcher = this._dispatcher;
		this._frontController.componentManager = this._componentManager;
		this._frontController.dbManager = this._dbManager;
		var viewManager = new ViewManager();
		this._frontController.viewManager = viewManager;
		var dispatcherError: DispatcherError = new DispatcherError();
		this._dispatcher.error = dispatcherError;

		viewManager.defaultView = "horpyna/jade/default";
		this._bootstrap = new Bootstrap(this);
	}
	/**
	 * dpdaje nowy moduł
	 */
	public addModule(moduleInstance: Module): Util.Promise<void> {
		return this._componentManager.addModule(moduleInstance);
	}
	/**
	 * zwraca moduł po nazwie
	 */
	public getModule(name:string):Module{
		return this._componentManager.getModule(name);
	}
	public set bootstrap(v:Bootstrap){
		this._bootstrap = v;
	}
	public get dispatcher():Dispatcher{
		return this._dispatcher;
	}
	public get frontController():FrontController{
		return this._frontController;
	}
	public get componentManager():ComponentManager{
		return this._componentManager;
	}
	public setDbDefaultConnection(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string){
		var connection = new Connection(dbType, host, port, dbName, userName, userPassword,"default");
		this._dbManager.addConnection(connection, true);
	}
	public init():Promise<any>{
		this._bootstrap.init();
		this.logger.info("Run Horpyna");
		this._frontController.debug("application:init:");
		this._frontController.debug("application:dispatcher.setRouter()");
		this._frontController.debug("application:frontController.init()");
		var promise = this._frontController.init();
		return promise;
	}
}
export = Application;