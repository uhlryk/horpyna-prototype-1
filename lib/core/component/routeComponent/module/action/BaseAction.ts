/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
import Event = require("../../../event/Event");
import Param = require("./param/Param");
import Util = require("./../../../../util/Util");
import Response = require("./Response");
import Request = require("./Request");
interface IActionHandler{
	(request:Request, response:Response, done:()=>void):void;
}

class BaseAction extends RouteComponent {
	private actionHandler:IActionHandler;
	private paramList:Param[];
	private queryList:Param[];
	private bodyList:Param[];
	private method:string;
	public static ALL:string = "all";
	public static POST:string = "post";
	public static GET:string = "get";
	public static PUT:string = "put";
	public static DELETE:string = "delete";

	constructor(method:string, name:string){
		super(name);
		this.debugger = new Util.Debugger("action:" + this.getName());
		this.method = method;
		this.paramList = [];
		this.queryList = [];
		this.bodyList = [];
	}
	protected onInit():void{
		super.onInit();
		this.initParams();
	}
	public initParams(){
		for(var index in this.paramList){
			var param:Param = this.paramList[index];
			param.logger = this.logger;
			param.init();
		};
		for(var index in this.queryList){
			var param:Param = this.queryList[index];
			param.init();
		};
		for(var index in this.bodyList){
			var param:Param = this.bodyList[index];
			param.init();
		};
	}
	public addQuery(param:Param){
		this.queryList.push(param);
		param.setParent(this);
	}
	public getQueryList():Param[]{
		return this.queryList;
	}
	public addParam(param:Param){
		this.paramList.push(param);
		param.setParent(this);
	}
	public getParamList():Param[]{
		return this.paramList;
	}
	public addBody(param:Param){
		this.bodyList.push(param);
		param.setParent(this);
	}
	public getBodyList():Param[]{
		return this.bodyList;
	}
	public getMethod():string {
		return this.method;
	}
	public getParam(name:string):Param{
		for(var index in this.paramList){
			var param:Param = this.paramList[index];
			if(param.getName() === name){
				return param;
			}
		}
	}
	public getBody(name:string):Param{
		for(var index in this.bodyList){
			var param:Param = this.bodyList[index];
			if(param.getName() === name){
				return param;
			}
		}
	}
	public getQuery(name:string):Param{
		for(var index in this.queryList){
			var param:Param = this.queryList[index];
			if(param.getName() === name){
				return param;
			}
		}
	}
	public setActionHandler(actionHandler:IActionHandler){
		this.actionHandler = actionHandler;
	}
	protected validateRequest(request:Request){
		for(var requestParamName in request.getBodyList()){
			var actionParam:Param = this.getBody(requestParamName);
			if(actionParam){
				actionParam.validate();
			} else{
				request.removeBody(requestParamName);
			}
		}
		for(var requestParamName in request.getQueryList()){
			var actionParam:Param = this.getQuery(requestParamName);
			if(actionParam){
				actionParam.validate();
			} else{
				request.removeQuery(requestParamName);
			}
		}
		for(var requestParamName in request.getParamList()){
			var actionParam:Param = this.getParam(requestParamName);
			if(actionParam){
				actionParam.validate();
			} else{
				request.removeParam(requestParamName);
			}
		}
	}
	protected requestHandler(request: Request, response: Response, doneAction) {
		this.debug("action:requestHandler:");
		this.debug("action:publish():OnBegin");
		Util.Promise.resolve()
		.then(() => {
			if (response.allow === false) return;
			return this.publish(request, response, Event.Action.OnBegin.EVENT_NAME)
		})
		.then(() => {
			if (response.allow === false) return;
			this.debug("action:validateRequest");
			return this.validateRequest(request);
		})
		.then(() => {
			if (response.allow === false) return;
			this.debug("action:publish():OnReady");
			return this.publish(request, response, Event.Action.OnReady.EVENT_NAME);
		})
		.then(() => {
			if (response.allow === false) return;
			return new Util.Promise<void>((resolve:()=>void)=> {
				this.debug("action: check actionHandler if exist");
				if (this.actionHandler) {
					this.debug("action: actionHandler exist");
					this.actionHandler(request, response, resolve);
				} else {
					this.debug("action: actionHandler not exist");
					resolve();
				}
			})
		})
		.then(() => {
			this.debug("action:finish");
			doneAction();
		})
		.catch((err)=>{
			this.logger.error(err);
			this.debug("error");
			response.setStatus(500);
			doneAction();
		});
	}
	public getRequestHandler(){
		this.debug("action:getRequestHandler()");
		return (request:Request, response:Response, next)=>{
			this.requestHandler(request, response, next);
		}
	}
}
export  = BaseAction;