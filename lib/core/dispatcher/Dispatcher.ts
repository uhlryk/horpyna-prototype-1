/// <reference path="../../../typings/tsd.d.ts" />
import Core = require("../../index");
import express = require("express");
import DispatcherError = require("./DispatcherError");
import ViewManager = require("./../view/ViewManager");
import Element = require("../Element");
class Dispatcher extends Element{
	private _componentManager: Core.ComponentManager;
	public static LAST_ERROR_NOT_SET: string = "Last error is not set'";
	private _router:express.Router;

	private _viewManager: ViewManager;
	/**
	 * Ostatni błąd na liście, jeśli pozostałe nie obsłużą błędu ten zakończy
	 */
	private _error: DispatcherError;
	/**
	 * Akcja wywoływana na końcu
	 */
	private _fallbackAction: Core.Action.BaseAction;
	/**
	 * Akcja do obsługi routera '/'
	 */
	private _homeAction: Core.Action.BaseAction;
	private _subRouter: express.Router;
	private _middlewareList: any[];
	constructor(_router: express.Router) {
		super();
		this.initDebug("dispatcher");
		this._router = _router;
		this._subRouter = express.Router();
		this._middlewareList = [];
	}
	public set viewManager(v : ViewManager) {
		this._viewManager = v;
	}
	private createRequest(req:express.Request):Core.Action.Request{
		var request = new Core.Action.Request(req);
		return request;
	}
	private createResponse(res:express.Response):Core.Action.Response{
		var response = new Core.Action.Response(res);
		return response;
	}
	public setComponentManager(v: Core.ComponentManager) {
		this._componentManager = v;
	}
	public setHomeAction(action:Core.Action.BaseAction){
		this._homeAction = action;
	}
	public setFallbackAction(action:Core.Action.BaseAction){
		this._fallbackAction = action;
	}
	public set error(error:DispatcherError){
		this._error = error;
	}
	public get error(): DispatcherError {
		return this._error;
	}
	/**
	 * dodaje moduły które są middleware. Zostaną one włączone do route.use jako pierwsze w aplikacji
	 * Można budować własne middleware lub używać zewnętrznych.
	 * @param {(req: Request, res: Response, next: Function)=>any} middleware
	 */
	public addMiddleware(middleware:any){
		this._middlewareList.push(middleware);
	}
	/**
	 * Pierwszy route w aplikacji
	 * Dodaje w pętli wszystkie middleware
	 */
	protected middlewareRoute(){
		for (var i = 0; i < this._middlewareList.length; i++){
			var middleware = this._middlewareList[i];
			this._router.use(middleware);
		}
	}
	/**
	 * Wywołuje się zawsze jako pierwsza akcja przed innymi
	 * najpierw tworzy obiekty response i request które są wrapperami na req i res expressa
	 */
	private beginRoute(){
		this._router.use((req,res,next)=>{
			this.debug('before route');
			var request = this.createRequest(req);
			req['horpynaRequest'] = request;
			var response = this.createResponse(res);
			res['horpynaResponse'] = response;
			this._componentManager.publish(request, response, Core.EventListener.Dispatcher.OnBegin.EVENT_NAME).then(() => { next(); });
		});
	}
	private homeRoute(){
		if (this._homeAction) {
			this._router.all("/", (req, res, next) => {
				this.debug('home route');
				var handler = this._homeAction.getRequestHandler();
				var request: Core.Action.Request = Core.Action.Request.ExpressToRequest(req);
				var response: Core.Action.Response = Core.Action.Response.ExpressToResponse(res);
				response.routePath = "/";
				handler(request, response, next);
				request.action = null;
			});
		} else {
			this.debug('home route empty');
		}
	}
	private finalRoute(){
		this._router.use((req, res, next) => {
			if (this._fallbackAction) {
				var request: Core.Action.Request = Core.Action.Request.ExpressToRequest(req);
				var response: Core.Action.Response = Core.Action.Response.ExpressToResponse(res);
				if (response.routePath === null) {
					this.debug('fallback route');
					var handler = this._fallbackAction.getRequestHandler();
					handler(request, response, next);
				} else {
					next();
				}
			} else {
				next();
			}
		});
		this._router.use((req, res, next) => {
			var request: Core.Action.Request = Core.Action.Request.ExpressToRequest(req);
			var response: Core.Action.Response = Core.Action.Response.ExpressToResponse(res);
			this.debug('final route');
			this._componentManager.publish(request, response, Core.EventListener.Dispatcher.OnFinal.EVENT_NAME).then(() => { next(); });
		});
		this._router.use((req, res) => {
			this.debug('final render');
			var response: Core.Action.Response = Core.Action.Response.ExpressToResponse(res);
			this._viewManager.render(req, res);
		});
	}
	private errorRoute(){
		this.debug('error route');
		this._router.use(this._error.getErrorHandler());
	}
	/**
	 * konfiguruje routy dla akcji
	 */
	private normalRoute(){
		this._router.use(this._subRouter);
	}
	public addRoute(method:string, routePath:string, beforeHandlerList:Function[], handler:Function){
		this.debug('standard route method:%s routePath:%s', method, routePath);
		var routerArgs: any[] = beforeHandlerList.slice();
		routerArgs.unshift(routePath);
		routerArgs.push((req, res, next) => {
			var request: Core.Action.Request = Core.Action.Request.ExpressToRequest(req);
			var response: Core.Action.Response = Core.Action.Response.ExpressToResponse(res);
			response.allow = true;
			response.routePath = routePath;
			this.runActionHandler(request, response, handler, next);
		});
		this._subRouter[method].apply(this._subRouter, routerArgs);
	}
	/**
	 * dla danej akcji odpala w Promise jej handler,
	 * jeśli akcja zwróci w response rządanie forwarda to rekurencyjnie funkcja odpali się ponownie
	 */
	private runActionHandler(actionRequest: Core.Action.Request, actionResponse: Core.Action.Response, handler: Function, next: () => void): Promise<void> {
		return new Promise<void>((resolve: () => void) => {
			handler(actionRequest, actionResponse, resolve);
		})
		.then(() => {
			var forwardAction = actionResponse.getForwardAction();
			if (forwardAction) {
				actionResponse.setForwardAction(null);
				return this.runActionHandler(actionRequest, actionResponse, forwardAction.getRequestHandler(), next);
			} else {
				next();
			}
		});
	}
	public init():void{
		if(this._error === undefined){
			this.logger.error(Dispatcher.LAST_ERROR_NOT_SET);
			throw new Error(Dispatcher.LAST_ERROR_NOT_SET);
		}
		this.middlewareRoute();
		this.beginRoute();
		this.homeRoute();
		this.normalRoute();
		this.finalRoute();
		this.errorRoute();
	}
}
export = Dispatcher;