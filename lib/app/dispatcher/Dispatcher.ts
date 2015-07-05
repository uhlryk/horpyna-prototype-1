/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import IModule = require("./../module/IModule");
import IAction = require("./../module/action/IAction");
import IActionMethod = require("./../module/action/IActionMethod");
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
	private createMethodRoutes(routeName:string, action:IAction){
		var handler = action.getHandler();
		switch(action.getMethod()){
			case IActionMethod.ALL:
				this.router.all(routeName,handler);
				break;
			case IActionMethod.GET:
				this.router.get(routeName,handler);
				break;
			case IActionMethod.POST:
				this.router.post(routeName,handler);
				break;
			case IActionMethod.PUT:
				this.router.put(routeName,handler);
				break;
			case IActionMethod.DELETE:
				this.router.delete(routeName,handler);
				break;
		}
	}
	private createActionRoutes(routeName:string, actionList:IAction[]){
		for(var actionIndex in actionList) {
			var action:IAction = actionList[actionIndex];
			routeName = this.buildRoute(routeName, action.getRouteName());
			this.createMethodRoutes(routeName, action);
		}
	}
	private createModuleRoutes(routeName:string, moduleList:IModule[]){
		for(var moduleIndex in moduleList){
			var module:IModule = moduleList[moduleIndex];
			routeName = this.buildRoute(routeName, module.getRouteName());
			this.createModuleRoutes(routeName, module.getModuleList());
			this.createActionRoutes(routeName, module.getActionList());
		};
	}
	public createRoutes(moduleList:IModule[]):void{
		this.baseRoute();

		this.createModuleRoutes("", moduleList);
		this.fallbackRoute();
	}
	private buildRoute(baseRoute:string, partRoute:string):string{
		if(baseRoute.slice(-1) !== "/"){
			baseRoute = baseRoute + "/";
		}
		return baseRoute + partRoute + "/";
	}
}
export = Dispatcher;