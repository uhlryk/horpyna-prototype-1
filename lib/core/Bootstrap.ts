/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");
import Application = require("./Application");
import Element = require("./Element");
import Component = require("./component/Component");
import Dispatcher = require("./dispatcher/Dispatcher");
import ViewManager = require("./view/ViewManager");
import DefaultModule = require("./component/routeComponent/module/DefaultModule");
import DispatcherError = require("./dispatcher/DispatcherError");
import Util = require("./util/Util");
import CatchPromise = require("./catchPromise/CatchPromise");
class Bootstrap extends Element {
	private _application:Application;
	private _router: express.Router;

	constructor(application:Application, router:express.Router){
		super();
		this.initDebug("bootstrap");
		this._application = application;
		this._router = router;
		this.onConstruct();
	}
	public get application():Application{
		return this._application;
	}
	public get router(): express.Router {
		return this._router;
	}
	protected onConstruct(){
		this.initLogger();
	}
	protected initLogger(){
		var logger = new Util.Logger("./log");
		Element.initLogger(logger);
		var morgan = new Util.Morgan("combined", logger.getStream());
		this.router.use(morgan.handler);
		return logger;
	}
	public init(){
		this.initDispatcher();
		this.initDefaultActions();
		this.initView();
		this.initCatchPromises();
		this.initFileUpload();
	}
	protected initDispatcher(){
		var dispatcher = this.application.dispatcher;
		var dispatcherError: DispatcherError = new DispatcherError();
		dispatcher.error = dispatcherError;
		return dispatcher;
	}
	protected initDefaultActions(){
		var dispatcher = this.application.dispatcher;
		var componentManager = this.application.componentManager;
		var defaultModule: DefaultModule = new DefaultModule(componentManager, "default");
		dispatcher.setFallbackAction(defaultModule.getFallbackAction());
		dispatcher.setHomeAction(defaultModule.getHomeAction());
	}
	protected initCatchPromises(){
		var componentManager = this.application.componentManager;
		componentManager.actionCatchPromiseManager.addCatch(new CatchPromise.Action.FinalCatchPromise(), true);
		componentManager.initCatchPromiseManager.addCatch(new CatchPromise.Init.FinalCatchPromise(), true);
		// componentManager.actionCatchPromiseManager.addCatch(new CatchPromise.Action.DbConnectionCatchPromise());
		// componentManager.initCatchPromiseManager.addCatch(new CatchPromise.Init.DbConnectionCatchPromise());
	}
	protected initView(){
		var viewManager = this.application.viewManager;
		viewManager.defaultView = "horpyna/jade/default";
		return viewManager;
	}
	protected initFileUpload(){
		this.addGlobalValue("uploadDirectory","./upload");
		this.addGlobalValue("fileMaxSize", 12);
		this.addGlobalValue("formMaxFiles", 5);
	}
}
export = Bootstrap;