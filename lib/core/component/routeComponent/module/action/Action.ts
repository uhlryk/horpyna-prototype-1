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

class Action extends RouteComponent {
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
	public init():void{
		this.onInit();
		this.initParams();
	}
	protected onInit():void{

	}
	public initParams(){
		for(var index in this.paramList){
			var param:Param = this.paramList[index];
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
	protected requestHandler(req:express.Request, res:express.Response){
		var request = this.createRequest(req);
		var response = new Response();	

		var beforeStartPublisher = new Event.Action.BeforeStart.Publisher();
		this.publish(beforeStartPublisher)
		.then((resp:Event.Action.BeforeStart.Response)=>{
			if(resp.isAllow()) {
				//TODO: validacja formularzy w promise
				var onReadyPublisher = new Event.Action.OnReady.Publisher();
				onReadyPublisher.setQuery(req.query);
				onReadyPublisher.setBody(req.body);
				onReadyPublisher.setParams(req.params);
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
						res.status(response.getStatus()).send(response.getContent());
				});
			} else {
				//TODO: przemyśleć obsługę blokady
				res.sendStatus(400);
			}
		});
	}
	private createRequest(req:express.Request):Request{
		var request = new Request();
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
	public getRequestHandler():express.RequestHandler{
		return (req:express.Request, res:express.Response)=>{
			this.requestHandler(req,res);
		}
	}
}
export  = Action;