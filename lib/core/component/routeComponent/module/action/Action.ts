/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
import Event = require("../../../event/Event");
import Param = require("./param/Param");
class Action extends RouteComponent {
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
	protected requestHandler(req:express.Request, res:express.Response){
		var beforeStartPublisher = new Event.Action.BeforeStart.Publisher();
		this.publish(beforeStartPublisher)
		.then((response:Event.Action.BeforeStart.Response)=>{
			if(response.isAllow()) {
				var onReadyPublisher = new Event.Action.OnReady.Publisher();
				onReadyPublisher.setQuery(req.query);
				onReadyPublisher.setBody(req.body);
				onReadyPublisher.setParams(req.params);
				this.publish(onReadyPublisher)
				.then((response:Event.Action.OnReady.Response)=>{
					//TODO: widoki i szablony
					//TODO: event BeforeEnd
					res.sendStatus(200);
				});
			} else {
				//TODO: przemyśleć obsługę blokady
				res.sendStatus(400);
			}
		});
	}
	public getRequestHandler():express.RequestHandler{
		return (req:express.Request, res:express.Response)=>{
			this.requestHandler(req,res);
		}
	}
}
export  = Action;