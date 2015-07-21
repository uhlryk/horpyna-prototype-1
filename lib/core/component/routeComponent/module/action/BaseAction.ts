/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
import Event = require("../../../event/Event");
import Param = require("./param/Param");
import Util = require("./../../../../util/Util");
import Response = require("./Response");
import Request = require("./Request");
import Validation = require("./Validation");
import ParamType = require("./param/ParamType");
interface IActionHandler{
	(request:Request, response:Response, done:()=>void):void;
}
class BaseAction extends RouteComponent {
	private actionHandler:IActionHandler;
	private paramList:Param[];
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
	}
	public addParam(param: Param) {
		param.setParent(this);
		this.paramList.push(param);
	}
	public getParamList(): Param[] {
		return this.paramList;
	}
	public getParamListByType(type:string): Param[] {
		var typeParamList = [];
		for (var index in this.paramList) {
			var param: Param = this.paramList[index];
			if(param.getType() === type){
				typeParamList.push(param);
			}
		};
		return typeParamList;
	}
	public getParam(type: string, name: string): Param {
		for (var index in this.paramList) {
			var param: Param = this.paramList[index];
			if (param.getName() === name && param.getType() === type) {
				return param;
			}
		}
		return null;
	}
	public getMethod():string {
		return this.method;
	}
	public setActionHandler(actionHandler:IActionHandler){
		this.actionHandler = actionHandler;
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
			var validation = new Validation(this, request);
			validation.validate();
			// tu testy czy walidacja poprawna
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
			if (response.allow === false) return;
			this.debug("action:publish():OnFinish");
			return this.publish(request, response, Event.Action.OnFinish.EVENT_NAME);
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