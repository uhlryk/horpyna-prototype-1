/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import DispatcherError = require("./DispatcherError");
import Util = require("./../util/Util");
import ViewManager = require("./../view/ViewManager");
import Module = require("./../component/routeComponent/module/Module");
import RouteComponent = require("./../component/routeComponent/RouteComponent");
import Action = require("./../component/routeComponent/module/action/Action");
import Field = require("./../component/routeComponent/module/action/field/Field");
import Element = require("../Element");
class Dispatcher extends Element{
	public static FINAL_ACTION_NOT_SET: string = "Final action is not set'";
	public static BEGIN_ACTION_NOT_SET: string = "Begin action is not set'";
	public static LAST_ERROR_NOT_SET: string = "Last error is not set'";
	private router:express.Router;
	private _viewManager: ViewManager;
	/**
	 * Ostatni błąd na liście, jeśli pozostałe nie obsłużą błędu ten zakończy
	 */
	private _error: DispatcherError;
	/**
	 * Akcja wywoływana na końcu
	 */
	private finalAction: Action.BaseAction;
	/**
	 * Akcja do obsługi routera '/'
	 */
	private homeAction: Action.BaseAction;
	/**
	 * Określa akcję wywoływaną przed wszystkimi. Możliwe że ta akcja będzie miała trochę inną
	 */
	private beginAction: Action.BaseAction;

	private subRouter: express.Router;
	constructor(router: express.Router) {
		super();
		this.initDebug("dispatcher");
		this.router = router;
		this.subRouter = express.Router();
	}
	public set viewManager(v : ViewManager) {
		this._viewManager = v;
	}
	private createRequest(req:express.Request):Action.Request{
		var request = new Action.Request(req);
		return request;
	}
	private createResponse(res:express.Response):Action.Response{
		var response = new Action.Response(res);
		return response;
	}
	public setBeginAction(action: Action.BaseAction) {
		this.beginAction = action;
	}
	public setHomeAction(action:Action.BaseAction){
		this.homeAction = action;
	}
	public setFinalAction(action:Action.BaseAction){
		this.finalAction = action;
	}
	public set error(error:DispatcherError){
		this._error = error;
	}
	public get error(): DispatcherError {
		return this._error;
	}
	/**
	 * Wywołuje się zawsze jako pierwsza akcja przed innymi
	 * najpierw tworzy obiekty response i request które są wrapperami na req i res expressa
	 */
	private beginRoute(){
		this.debug('before route');
		this.router.use((req,res,next)=>{
			var handler = this.beginAction.getRequestHandler();
			var request = this.createRequest(req);
			req['horpynaRequest'] = request;
			var response = this.createResponse(res);
			res['horpynaResponse'] = response;
			response.allow = true;
			handler(request, response, next);
		});
	}
	private homeRoute(){
		if (this.homeAction) {
			this.debug('home route');
			this.router.all("/", (req, res, next) => {
				var handler = this.homeAction.getRequestHandler();
				var request: Action.Request = req['horpynaRequest'];
				var response: Action.Response = res['horpynaResponse'];
				response.allow = true;
				response.routePath = "/";
				handler(request, response, next);
			});
		} else {
			this.debug('home route empty');
		}
	}
	private finalRoute(){
		this.debug('final route');
		this.router.use((req, res, next) => {
			var handler = this.finalAction.getRequestHandler();
			var request: Action.Request = req['horpynaRequest'];
			var response: Action.Response = res['horpynaResponse'];
			response.allow = true;
			this.debug('final action');
			handler(request, response, next);
		});
		this.router.use((req, res) => {
			this.debug('final render');
			var response: Action.Response = res['horpynaResponse'];
			this._viewManager.render(req, res);
		});
	}
	private errorRoute(){
		this.debug('error route');
		this.router.use(this._error.getErrorHandler());
	}
	/**
	 * konfiguruje routy dla akcji
	 */
	private normalRoute(){
		this.router.use(this.subRouter);
	}
	public addRoute(method:string, routePath:string, handler:Function){
		this.subRouter[method](routePath, (req, res, next) => {
			var request: Action.Request = req['horpynaRequest'];
			var response: Action.Response = res['horpynaResponse'];
			response.allow = true;
			response.routePath = routePath;
			handler(request, response, next);
		});
	}
	public init():void{
		if(this.beginAction === undefined){
			this.logger.error(Dispatcher.BEGIN_ACTION_NOT_SET);
			throw new Error(Dispatcher.BEGIN_ACTION_NOT_SET);
		}
		if(this.finalAction === undefined){
			this.logger.error(Dispatcher.FINAL_ACTION_NOT_SET);
			throw new Error(Dispatcher.FINAL_ACTION_NOT_SET);
		}
		if(this._error === undefined){
			this.logger.error(Dispatcher.LAST_ERROR_NOT_SET);
			throw new Error(Dispatcher.LAST_ERROR_NOT_SET);
		}
		this.debug('start');
		this.beginRoute();
		this.homeRoute();
		this.normalRoute();
		this.finalRoute();
		this.errorRoute();
		this.debug('end');
	}
}
export = Dispatcher;