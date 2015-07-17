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
	public addActionHandler(actionHandler:IActionHandler){
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
	protected requestHandler(request:Request, response:Response){
		var beforeStartPublisher = new Event.Action.BeforeStart.Publisher();
		this.publish(beforeStartPublisher)
		.then((resp:Event.Action.BeforeStart.Response)=>{
			if(resp.isAllow()) {
				this.validateRequest(request);
				response.setStatus(200);
				//TODO: validacja formularzy w promise
				var onReadyPublisher = new Event.Action.OnReady.Publisher();
				//onReadyPublisher.setQuery(req.query);
				//onReadyPublisher.setBody(req.body);
				//onReadyPublisher.setParams(req.params);
				this.publish(onReadyPublisher)
				.then((responseOnReady:Event.Action.OnReady.Response)=> {
					return new Util.Promise<void>((resolve:()=>void)=> {
						if (this.actionHandler) {
							this.actionHandler(request, response, resolve);
						} else {
							resolve();
						}
					})
				})
				.then(()=>{
						response.render();
						//res.status(response.getStatus()).send(response.getContent());
				});
			} else {
				response.setStatus(400);
				//TODO: przemyśleć obsługę blokady
				response.render();
			}
		});
	}
	private createRequest(req:express.Request):Request{
		var request = new Request(this, req);
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
	private createResponse(res:express.Response):Response{
		var response = new Response(this, res, this.getViewClass());
		return response;
	}
	public getRequestHandler():express.RequestHandler{
		return (req:express.Request, res:express.Response)=>{
			this.requestHandler(this.createRequest(req),this.createResponse(res));
		}
	}
}
export  = BaseAction;