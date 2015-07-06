/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("./../component/routeComponent/module/Module");
import Action = require("./../component/routeComponent/module/action/Action");
//import IActionMethod = require("./../component/routeComponent/module/action/IActionMethod");
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
	private createMethodRoutes(routeName:string, action:Action){
		var handler = action.getHandler();
		switch(action.getMethod()){
			case Action.ALL:
				this.router.all(routeName,handler);
				break;
			case Action.GET:
				this.router.get(routeName,handler);
				break;
			case Action.POST:
				this.router.post(routeName,handler);
				break;
			case Action.PUT:
				this.router.put(routeName,handler);
				break;
			case Action.DELETE:
				this.router.delete(routeName,handler);
				break;
		}
	}
	private createActionRoutes(routeName:string, actionList:Action[]){
		for(var actionIndex in actionList) {
			var action:Action = actionList[actionIndex];
			routeName = this.buildRoute(routeName, action.getRoute());
			this.createMethodRoutes(routeName, action);
		}
	}
	private createModuleRoutes(routeName:string, moduleList:Module[]){
		for(var moduleIndex in moduleList){
			var module:Module = moduleList[moduleIndex];
			routeName = this.buildRoute(routeName, module.getRoute());
			this.createModuleRoutes(routeName, module.getModuleList());
			this.createActionRoutes(routeName, module.getActionList());
		};
	}
	public createRoutes(moduleList:Module[]):void{
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