/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("./../component/routeComponent/module/Module");
import Action = require("./../component/routeComponent/module/action/Action");
import Param = require("./../component/routeComponent/module/action/param/Param");
class Dispatcher{
	private router:express.Router;
	constructor() {

	}
	public setRouter(router:express.Router):void{
		this.router = router;
	}
	public getRouter(){
		return this.router;
	}
	private baseRoute(){
		this.router.all("/", function (req, res) {
			res.sendStatus(200);
		});
	}
	private fallbackRoute(){
		this.router.use(function (req, res, next) {
			res.sendStatus(404);
		});
	}
	private createMethodRoutes(routeName:string, action:Action.BaseAction){
		var handler = action.getRequestHandler();
		switch(action.getMethod()){
			case Action.BaseAction.ALL:
				this.router.all(routeName,handler);
				break;
			case Action.BaseAction.GET:
				this.router.get(routeName,handler);
				break;
			case Action.BaseAction.POST:
				this.router.post(routeName,handler);
				break;
			case Action.BaseAction.PUT:
				this.router.put(routeName,handler);
				break;
			case Action.BaseAction.DELETE:
				this.router.delete(routeName,handler);
				break;
		}
	}
	private createActionRoutes(routeName:string, actionList:Action.BaseAction[], defaultActionList?:Action.BaseAction[]){
		for(var actionIndex in actionList) {
			var action:Action.BaseAction = actionList[actionIndex];
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
			if(defaultModule === module){//dany moduł jest defaultowy
				newRouteName = routeName;
			} else {
				newRouteName = this.buildRoute(routeName, module.getRoute());
			}
			this.createModuleRoutes(newRouteName, module.getModuleList(), module.getDefaultModule());
			this.createActionRoutes(newRouteName, module.getActionList(), module.getDefaultActionList());
		};
	}
	public createRoutes(moduleList:Module[], defaultModule?:Module):void{
		this.baseRoute();

		this.createModuleRoutes("", moduleList, defaultModule);
		this.fallbackRoute();
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