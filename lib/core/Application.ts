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
class Application {
	public static MODULE_PATH_NONE: string = "Need 'module path'";
	private logger:Util.Logger;
	private frontController:FrontController;
	private dispatcher:Dispatcher;
	private componentManager:ComponentManager;
	private dbManager:DbManager;
	private router:express.Router;
	constructor() {
		this.logger = new Util.Logger();
		this.frontController = new FrontController();
		this.dispatcher = new Dispatcher();
		this.componentManager = new ComponentManager();
		this.dbManager = new DbManager();
		this.frontController.setLogger(this.logger);
		this.frontController.setDispatcher(this.dispatcher);
		this.frontController.setComponentManager(this.componentManager);
		this.frontController.setDbManager(this.dbManager);
		this.router = express.Router();
	}
	public setViewClass(viewClass){
		this.componentManager.setViewClass(viewClass);
	}
	public addModule(moduleInstance:Module):void{
		this.componentManager.addModule(moduleInstance);
	}
	public setDbDefaultConnection(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string){
		var connection = new Connection(dbType, host, port, dbName, userName, userPassword,"default");
		this.dbManager.addConnection(connection, true);
	}
	public init():Promise<any>{
		this.logger.info("Run Horpyna");
		this.dispatcher.setRouter(this.router);
		var promise = this.frontController.init();
		return promise;
	}
	public getMiddleware():express.Router{
		return this.router;
	}
	public getLogger():Util.Logger{
		return this.logger;
	}
}
export = Application;