/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Util = require("./../util/Util");
import Module = require("./../component/routeComponent/module/Module");
import Action = require("./../component/routeComponent/module/action/Action");
import Param = require("./../component/routeComponent/module/action/param/Param");
class Dispatcher{
	public static FALLBACK_ACTION_NOT_SET: string = "Fallback action is not set'";
	public static BEFORE_ALL_ACTION_NOT_SET: string = "BeforeAll action is not set'";
	private router:express.Router;
	private debugger: Util.Debugger;
	private logger: Util.Logger;
	/**
	 * Akcja wywoływana gdy brak jakiego kolwiek routera który by ją odebrał
	 */
	private fallbackAction: Action.BaseAction;
	/**
	 * Akcja do obsługi routera '/'
	 */
	private homeAction: Action.BaseAction;
	/**
	 * Określa akcję wywoływaną przed wszystkimi. Możliwe że ta akcja będzie miała trochę inną
	 * strukturę niż pozostałe. Obecnie jest taka sama
	 * @type {Action.BaseAction}
	 */
	private beforeAllAction: Action.BaseAction;
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
		for(var index in req.body){
			request.addBody(index, req.body[index]);
		}
		for(var index in req.query){
			request.addQuery(index, req.query[index]);
		}
		for(var index in req.params){
			request.addParam(index, req.params[index]);
		}
		return request;
	}
	private createResponse(res:express.Response):Action.Response{
		var response = new Action.Response(res);
		return response;
	}
	public setBeforeAllAction(action: Action.BaseAction) {
		this.beforeAllAction = action;
	}
	public setHomeAction(action:Action.BaseAction){
		this.homeAction = action;
	}
	public setFallbackAction(action:Action.BaseAction){
		this.fallbackAction = action;
	}
	/**
	 * Wywołuje się zawsze jako pierwsza akcja przed innymi
	 * najpierw tworzy obiekty response i request które są wrapperami na req i res expressa
	 */
	private beforeRoute(){
		this.debug('before route');
		this.router.use((req,res,next)=>{
			var request = this.createRequest(req);
			req['horpynaRequest'] = request;
			var response = this.createResponse(res);
			res['horpynaResponse'] = response;
			var handler = this.beforeAllAction.getRequestHandler();
			handler(request, response, next);
		});
	}
	private homeRoute(){
		if (this.homeAction) {
			this.debug('home route');
			var handler = this.homeAction.getRequestHandler();
			this.router.all("/", (req, res) => {
				handler(req['horpynaRequest'], res['horpynaResponse']);
			});
		} else {
			this.debug('home route empty');
		}
	}
	private fallbackRoute(){
		this.debug('fallback route');
		var handler = this.fallbackAction.getRequestHandler();
		this.router.use((req, res) => {
			handler(req['horpynaRequest'], res['horpynaResponse']);
		});
	}
	//TODO:rebuild
	private errorHandler(){
		this.router.use(this.errHandler);
	}
	//TODO:rebuild
	private errHandler(err, req, res, next) {
		console.error(err.stack);
	}
	private createMethodRoutes(routeName:string, action:Action.BaseAction){
		this.debug('create route %s:%s for action: %s', action.getMethod(), routeName, action.getName());
		var handler = action.getRequestHandler();
		switch(action.getMethod()){
			case Action.BaseAction.ALL:
				this.router.all(routeName, (req, res) => {
					handler(req['horpynaRequest'], res['horpynaResponse']);
				});
				break;
			case Action.BaseAction.GET:
				this.router.get(routeName, (req, res) => {
					handler(req['horpynaRequest'], res['horpynaResponse']);
				});
				break;
			case Action.BaseAction.POST:
				this.router.post(routeName, (req, res) => {
					handler(req['horpynaRequest'], res['horpynaResponse']);
				});
				break;
			case Action.BaseAction.PUT:
				this.router.put(routeName, (req, res) => {
					handler(req['horpynaRequest'], res['horpynaResponse']);
				});
				break;
			case Action.BaseAction.DELETE:
				this.router.delete(routeName, (req, res) => {
					handler(req['horpynaRequest'], res['horpynaResponse']);
				});
				break;
		}
	}
	private createActionRoutes(routeName:string, actionList:Action.BaseAction[], defaultActionList?:Action.BaseAction[]){
		for(var actionIndex in actionList) {
			var action:Action.BaseAction = actionList[actionIndex];
			if(action === this.fallbackAction){
				continue;//nie tworzymy w sposób standardowy route dla fallback action
			}
			if(action === this.homeAction){
				continue;//nie tworzymy w sposób standardowy route dla home action
			}
			var newRouteName;
			if(!defaultActionList || defaultActionList.indexOf(action) === -1){//nie jest na liście default
				newRouteName = this.buildRoute(routeName, action.getRoute());
			} else{//jest default
				newRouteName = routeName;
			}
			var paramList = action.getParamList();
			for(var paramIndex in paramList){
				var param:Param = paramList[paramIndex];
				newRouteName = this.buildRoute(newRouteName, ":" + param.getParam());
			}
			this.createMethodRoutes(newRouteName, action);
		}
	}
	private createModuleRoutes(routeName:string, moduleList:Module[], defaultModule?:Module){
		for(var moduleIndex in moduleList){
			var module:Module = moduleList[moduleIndex];
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
		if(this.beforeAllAction === undefined){
			this.logger.error(Dispatcher.BEFORE_ALL_ACTION_NOT_SET);
			throw new Error(Dispatcher.BEFORE_ALL_ACTION_NOT_SET);
		}
		if(this.fallbackAction === undefined){
			this.logger.error(Dispatcher.FALLBACK_ACTION_NOT_SET);
			throw new Error(Dispatcher.FALLBACK_ACTION_NOT_SET);
		}
		this.debug('start');
		this.beforeRoute();
		this.homeRoute();

		this.createModuleRoutes("", moduleList, defaultModule);
		this.fallbackRoute();
		this.errorHandler();
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