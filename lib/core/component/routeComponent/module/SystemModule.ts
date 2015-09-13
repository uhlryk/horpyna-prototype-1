/// <reference path="../../../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("./Module");
import Action = require("./action/Action");
import Util = require("../../../util/Util");
/**
 * Moduł systemowy który zawiera akcję Begin, Home i Final
 */
class SystemModule extends  Module{
	public static ACTION_HOME = "home";
	public static ACTION_FINAL = "final";
	public static ACTION_BEGIN = "begin";
	public onConstructor(){
		super.onConstructor();
		var beginAction: Action.BaseAction = new Action.BaseAction(this, Action.BaseAction.ALL, SystemModule.ACTION_BEGIN);
		beginAction.setActionHandler((request, response) => {
			return this.onBeginAction(request, response);
		});
		var finalAction: Action.BaseAction = new Action.BaseAction(this, Action.BaseAction.ALL, SystemModule.ACTION_FINAL);
		finalAction.setActionHandler((request, response) => {
			return this.onFinalAction(request, response);
		});
		var homeAction: Action.BaseAction = new Action.BaseAction(this, Action.BaseAction.ALL, SystemModule.ACTION_HOME);
		homeAction.setActionHandler((request, response) => {
			return this.onHomeAction(request, response);
		});
	}
	protected onBeginAction(request: Action.Request, response: Action.Response): Util.Promise<void> {
		return Util.Promise.resolve();
	}
	protected onFinalAction(request: Action.Request, response: Action.Response): Util.Promise<void> {
		if (response){
			if(response.routePath === null){
				response.setStatus(404);
			}
		}
		return Util.Promise.resolve();
	}
	protected onHomeAction(request: Action.Request, response: Action.Response): Util.Promise<void> {
		return Util.Promise.resolve();
	}
}
export = SystemModule;