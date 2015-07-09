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
import ModuleManager = require("./moduleManager/ModuleManager");
import Module = require("./component/routeComponent/module/Module");
class Application {
	public static MODULE_PATH_NONE: string = "Need 'module path'";

	private frontController:FrontController;
	private dispatcher:Dispatcher;
	private moduleManager:ModuleManager;
	private dbManager:DbManager;
	private router:express.Router;
	constructor() {
		this.frontController = new FrontController();
		this.dispatcher = new Dispatcher();
		this.moduleManager = new ModuleManager();
		this.dbManager = new DbManager();
		this.frontController.setDispatcher(this.dispatcher);
		this.frontController.setModuleManager(this.moduleManager);
		this.frontController.setDbManager(this.dbManager);
		this.router = express.Router();
	}
	public addModule(moduleInstance:Module):void{
		this.moduleManager.addModule(moduleInstance);
	}
	public setDbDefaultConnection(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string){
		var connection = new Connection(dbType, host, port, dbName, userName, userPassword);
		this.dbManager.addConnection(connection, true);
	}
	public init():Promise<any>{
		this.dispatcher.setRouter(this.router);
		var promise = this.frontController.init();
		return promise;
	}
	public getMiddleware():express.Router{
		return this.router;
	}
}
export = Application;