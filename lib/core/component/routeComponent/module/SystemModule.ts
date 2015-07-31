/// <reference path="../../../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("./Module");
import Action = require("./action/Action");
/**
 * Moduł systemowy który zawiera akcję Begin, Home i Final
 */
class SystemModule extends  Module{
	public static ACTION_HOME = "home";
	public static ACTION_FINAL = "final";
	public static ACTION_BEGIN = "begin";
	public onConstructor(){
		super.onConstructor();
		var beginAction: Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, SystemModule.ACTION_BEGIN);
		this.addAction(beginAction);
		beginAction.setActionHandler((request, response, done) => {
			this.onBeginAction(request, response, done);
		});
		var finalAction: Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, SystemModule.ACTION_FINAL);
		this.addAction(finalAction);
		finalAction.setActionHandler((request, response, done) => {
			this.onFinalAction(request, response, done);
		});
		var homeAction: Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, SystemModule.ACTION_HOME);
		this.addAction(homeAction);
		homeAction.setActionHandler((request, response, done) => {
			this.onHomeAction(request, response, done);
		});
	}
	protected onBeginAction(request: Action.Request, response: Action.Response, done) {
		done();
	}
	protected onFinalAction(request: Action.Request, response: Action.Response, done) {
		if (response){
			if(response.routePath === null){
				response.setStatus(404);
			}
		}
		done();
	}
	protected onHomeAction(request: Action.Request, response: Action.Response, done) {
		done();
	}
}
export = SystemModule;