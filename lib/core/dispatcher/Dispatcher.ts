/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Util = require("./../util/Util");
import Module = require("./../component/routeComponent/module/Module");
import Action = require("./../component/routeComponent/module/action/Action");
import Field = require("./../component/routeComponent/module/action/field/Field");
class Dispatcher{
	public static FINAL_ACTION_NOT_SET: string = "Final action is not set'";
	public static BEGIN_ACTION_NOT_SET: string = "Begin action is not set'";
	public static LAST_ERROR_NOT_SET: string = "Last error is not set'";
	private router:express.Router;
	private debugger: Util.Debugger;
	private logger: Util.Logger;
	/**
	 * Ostatni błąd na liście, jeśli pozostałe nie obsłużą błędu ten zakończy
	 */
	private lastError: Action.ErrorAction;
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
	constructor() {
		this.debugger = new Util.Debugger("dispatcher");
	}
	public setLogger(logger: Util.Logger) {
		this.logger = logger;
	}
	public debug(...args: any[]) {
		this.debugger.debug(args);
	}

	public setRouter(router:express.Router):void{
		this.router = router;
	}
	public getRouter(){
		return this.router;
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
	public setLastError(error:Action.ErrorAction){
		this.lastError = error;
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
				response.setAction(this.homeAction);
				request.setAction(this.homeAction);
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
			if (response.isRedirect()) {
				response.redirect();
			} else {
				response.render();
			}
		});
	}
	private lastErrorRoute(){
		this.debug('last error route');
		this.router.use(this.lastError.getErrorHandler());
	}
	private standardActionHandler(action, req, res, next){
		var handler = action.getRequestHandler();
		var request: Action.Request = req['horpynaRequest'];
		var response: Action.Response = res['horpynaResponse'];
		response.allow = true;
		this.debug("view class: " + action.getViewClass());
		response.setViewClass(action.getViewClass());
		response.setAction(action);
		request.setAction(action);
		handler(request, response, next);
	}
	/**
	 * w tej metodzie dodatkowo jest określany sposób renderowania widoku
	 */
	private createMethodRoutes(routeName:string, action:Action.BaseAction){
		this.debug('create route %s:%s for action: %s', action.getMethod(), routeName, action.getName());
		switch(action.getMethod()){
			case Action.BaseAction.ALL:
				this.router.all(routeName, (req, res, next) => {
					this.standardActionHandler(action, req, res, next);
				});
				break;
			case Action.BaseAction.GET:
				this.router.get(routeName, (req, res, next) => {
					this.standardActionHandler(action, req, res, next);
				});
				break;
			case Action.BaseAction.POST:
				this.router.post(routeName, (req, res, next) => {
					this.standardActionHandler(action, req, res, next);
				});
				break;
			case Action.BaseAction.PUT:
				this.router.put(routeName, (req, res, next) => {
					this.standardActionHandler(action, req, res, next);
				});
				break;
			case Action.BaseAction.DELETE:
				this.router.delete(routeName, (req, res, next) => {
					this.standardActionHandler(action, req, res, next);
				});
				break;
		}
	}
	private createActionRoutes(routeName:string, actionList:Action.BaseAction[], defaultActionList?:Action.BaseAction[]){
		for(var actionIndex in actionList) {
			var action:Action.BaseAction = actionList[actionIndex];
			if(action === this.finalAction){
				continue;//nie tworzymy w sposób standardowy route dla fallback action
			}
			if(action === this.homeAction){
				continue;//nie tworzymy w sposób standardowy route dla home action
			}
			if (action === this.beginAction) {
				continue;//nie tworzymy w sposób standardowy route dla home action
			}
			action.routePath = routeName;
			var newRouteName;
			if(!defaultActionList || defaultActionList.indexOf(action) === -1){//nie jest na liście default
				newRouteName = this.buildRoute(routeName, action.getRoute());
			} else{//jest default
				newRouteName = routeName;
			}
			var fieldList = action.getFieldListByType(Action.FieldType.PARAM_FIELD);
			for(var fieldIndex in fieldList){
				var field:Field = fieldList[fieldIndex];
				newRouteName = this.buildRoute(newRouteName, ":" + field.getFieldName());
			}
			this.createMethodRoutes(newRouteName, action);
		}
	}
	private createModuleRoutes(routeName:string, moduleList:Module[], defaultModule?:Module){
		for(var moduleIndex in moduleList){
			var module:Module = moduleList[moduleIndex];
			module.routePath = routeName;
			var newRouteName;
			if(defaultModule === module){//dany moduł jest ustawiony jak defaultowy więc nie dodaje route
				newRouteName = routeName;
			} else {
				newRouteName = this.buildRoute(routeName, module.getRoute());
			}
			this.createModuleRoutes(newRouteName, module.getModuleList(), module.getDefaultModule());
			this.createActionRoutes(newRouteName, module.getActionList(), module.getDefaultActionList());
		};
	}
	public createRoutes(moduleList:Module[], defaultModule?:Module):void{
		if(this.beginAction === undefined){
			this.logger.error(Dispatcher.BEGIN_ACTION_NOT_SET);
			throw new Error(Dispatcher.BEGIN_ACTION_NOT_SET);
		}
		if(this.finalAction === undefined){
			this.logger.error(Dispatcher.FINAL_ACTION_NOT_SET);
			throw new Error(Dispatcher.FINAL_ACTION_NOT_SET);
		}
		if(this.lastError === undefined){
			this.logger.error(Dispatcher.LAST_ERROR_NOT_SET);
			throw new Error(Dispatcher.LAST_ERROR_NOT_SET);
		}
		this.debug('start');
		this.beginRoute();
		this.homeRoute();

		this.createModuleRoutes("", moduleList, defaultModule);
		this.finalRoute();
		this.lastErrorRoute();
		this.debug('end');
	}
	private buildRoute(baseRoute:string, partRoute:string):string{
		if(baseRoute.slice(-1) !== "/"){
			baseRoute = baseRoute + "/";
		}
		if(partRoute) {
			return baseRoute + partRoute + "/";
		} else {
			return baseRoute;
		}
	}
}
export = Dispatcher;