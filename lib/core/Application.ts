/// <reference path="../../typings/tsd.d.ts" />
/**
 * Jest to wyższy poziom abstrakcji frontControllera,
 * na tym poziomie może wyglądać jak wrapper tylko.
 * Ale docelowo będą interfejsy dla RouteControllera i ModuleControllera
 * i na tym poziomie będzie można je zmieniać i wstawiać do frontControllera
 */
import express = require("express");
import FrontController = require("./FrontController");
import Dispatcher = require("./dispatcher/Dispatcher");
import DbManager = require("./dbManager/DbManager");
import Connection = require("./dbManager/connection/Connection");
import ComponentManager = require("./component/ComponentManager");
import Util = require("./util/Util");
import Module = require("./component/routeComponent/module/Module");
import ViewManager = require("./view/ViewManager");
import DispatcherError = require("./dispatcher/DispatcherError");
class Application {
	public static MODULE_PATH_NONE: string = "Need 'module path'";
	private logger:Util.Logger;
	private frontController:FrontController;
	private _dispatcher:Dispatcher;
	private componentManager:ComponentManager;
	private dbManager:DbManager;

	constructor(router:express.Router) {
		this.logger = new Util.Logger();
		this.frontController = new FrontController();
		this.frontController.debug("application:constructor:");
		this._dispatcher = new Dispatcher(router);
		this.componentManager = new ComponentManager();
		this.dbManager = new DbManager();
		this.frontController.setLogger(this.logger);
		this.frontController.setDispatcher(this._dispatcher);
		this.frontController.setComponentManager(this.componentManager);
		this.frontController.setDbManager(this.dbManager);
		var viewManager = new ViewManager();
		this.frontController.setViewManager(viewManager);
		var dispatcherError: DispatcherError = new DispatcherError();
		this._dispatcher.error = dispatcherError;

		viewManager.setDefaultView("horpyna/jade/default");
	}
	/**
	 * dpdaje nowy moduł
	 */
	public addModule(moduleInstance: Module): Util.Promise<void> {
		return this.componentManager.addModule(moduleInstance);
	}
	/**
	 * zwraca moduł po nazwie
	 */
	public getModule(name:string):Module{
		return this.componentManager.getModule(name);
	}
	public get dispatcher():Dispatcher{
		return this._dispatcher;
	}
	public setDbDefaultConnection(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string){
		var connection = new Connection(dbType, host, port, dbName, userName, userPassword,"default");
		this.dbManager.addConnection(connection, true);
	}
	public init():Promise<any>{
		this.logger.info("Run Horpyna");
		this.frontController.debug("application:init:");
		this.frontController.debug("application:dispatcher.setRouter()");
		this.frontController.debug("application:frontController.init()");
		var promise = this.frontController.init();
		return promise;
	}
	public getLogger():Util.Logger{
		return this.logger;
	}
}
export = Application;