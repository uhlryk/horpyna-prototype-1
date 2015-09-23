/// <reference path="../../typings/tsd.d.ts" />
import express = require('express');
/**
 * Jest to wyższy poziom abstrakcji frontControllera,
 * na tym poziomie może wyglądać jak wrapper tylko.
 * Ale docelowo będą interfejsy dla RouteControllera i ModuleControllera
 * i na tym poziomie będzie można je zmieniać i wstawiać do frontControllera
 */
import Bootstrap = require("./Bootstrap");
import Config = require("./Config");
import Server = require("./Server");
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
	private _server: Server;
	private _config: Config;
	constructor(config?: Object, env?: string) {
		super();
		this._config = new Config(env || process.env.NODE_ENV);
		if (config){
			this._config.setConfig(config);
		}
		var port;
		if(this.config.isKey("app")){
			port = this.config.getKey("app").port;
		}
		this._server = new Server(port);
		this._frontController = new FrontController();
		this._frontController.debug("application:constructor:");
		this._frontController.dispatcher = new Dispatcher(this._server.app);
		this._frontController.dbManager = new DbManager();
		this._frontController.componentManager = new ComponentManager(this._frontController.dispatcher, this._frontController.dbManager);
		this._frontController.viewManager = new ViewManager();
		this._frontController.dispatcher.setComponentManager(this._frontController.componentManager);
		this._bootstrap = new Bootstrap(this, this._server.app);
	}
	public get config(): Config{
		return this._config;
	}
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
	public get server():Server {
		return this._server;
	}
	public get appServer(): express.Express {
		return this._server.app;
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
	public run(): Promise<any> {
		return this.init().then(()=> {
			return this._server.run();
		});
	}
}
export = Application;