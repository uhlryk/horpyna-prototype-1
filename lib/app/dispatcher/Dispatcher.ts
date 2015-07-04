/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import IModule = require("./../module/IModule");
import IController = require("./../module/controller/IController");
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
			var actionRouteName = action.getRouteName();
			this.createMethodRoutes(routeName+"/"+actionRouteName, action);

		}

	}
	private createControllerRoutes(routeName:string, controllerList:IController[]){
		for(var controllerIndex in controllerList){
			var controller:IController = controllerList[controllerIndex];
			var controllerRouteName = controller.getRouteName();
			var actionList = controller.getActionList();
			this.createActionRoutes(routeName+"/"+controllerRouteName, actionList);
		}
	}
	private createModuleRoutes(moduleList:IModule[]){
		for(var moduleIndex in moduleList){
			var module:IModule = moduleList[moduleIndex];
			var moduleRouteName = module.getRouteName();
			var controllerList = module.getControllerList();
			this.createControllerRoutes("/"+moduleRouteName, controllerList);
		};
	}
	public createRoutes(moduleList:IModule[]):void{
		this.baseRoute();

		this.createModuleRoutes(moduleList);
		this.fallbackRoute();
	}
}
export = Dispatcher;