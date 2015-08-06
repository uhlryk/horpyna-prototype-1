/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");
import Application = require("./Application");
import Element = require("./Element");
import Dispatcher = require("./dispatcher/Dispatcher");
import ViewManager = require("./view/ViewManager");
import SystemModule = require("./component/routeComponent/module/SystemModule");
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
		Element.initLogger(logger)
		this.router.use(require('morgan')("combined", { stream: logger.getStream() }));
		return logger;
	}
	public init(){
		this.initDispatcher();
		this.initSystemActions();
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
	protected initSystemActions(){
		var dispatcher = this.application.dispatcher;
		var componentManager = this.application.componentManager;
		var defaultModule: SystemModule = new SystemModule("default");
		componentManager.addModule(defaultModule);
		var beginAction = defaultModule.getAction(SystemModule.ACTION_BEGIN);
		dispatcher.setBeginAction(beginAction);
		var finalAction = defaultModule.getAction(SystemModule.ACTION_FINAL);
		dispatcher.setFinalAction(finalAction);
		var homeAction = defaultModule.getAction(SystemModule.ACTION_HOME);
		dispatcher.setHomeAction(homeAction);
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