/// <reference path="../../../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("./Module");
import Action = require("./action/Action");

class DefaultModule extends  Module{
	public static ACTION_HOME = "home";
	public static ACTION_FINAL = "final";
	public static ACTION_BEGIN = "begin";
	public static ERROR_LAST = "error-last";
	public errorAction: Action.ErrorAction;
	public onConstructor(){
		super.onConstructor();
		var beginAction: Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_BEGIN);
		this.addAction(beginAction);
		beginAction.setActionHandler((request, response, done) => {
			this.onBeginAction(request, response, done);
		});
		var finalAction:Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_FINAL);
		this.addAction(finalAction);
		finalAction.setActionHandler((request, response, done) => {
			this.onFinalAction(request, response, done);
		});
		var homeAction:Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_HOME);
		this.addAction(homeAction);
		homeAction.setActionHandler((request, response, done) => {
			this.onHomeAction(request, response, done);
		});
		var errorAction: Action.ErrorAction = new Action.ErrorAction(DefaultModule.ERROR_LAST);
		this.errorAction = errorAction;
		errorAction.setErrorHandler((err: any, req: express.Request, res: express.Response, next: Function)=>{
			this.errorHandler(err,req,res,next);
		});
	}
	private onBeginAction(request: Action.Request, response: Action.Response, done) {
		done();
	}
	private onFinalAction(request: Action.Request, response: Action.Response, done) {
		if (response){
			if(response.getAction() === undefined){
				response.setStatus(404);
			}
		}
		done();
	}
	private onHomeAction(request: Action.Request, response: Action.Response, done) {
		done();
	}
	private errorHandler(err:any, req:express.Request, res:express.Response,next:Function){
		if (err.stack) {
			this.logger.error(err.stack);
		}
		res.sendStatus(500);
	}
}
export = DefaultModule;