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
	protected addQuery(param:Param){
		this.queryList.push(param);
		param.setParent(this);
	}
	public getQueryList():Param[]{
		return this.queryList;
	}
	protected addParam(param:Param){
		this.paramList.push(param);
		param.setParent(this);
	}
	public getParamList():Param[]{
		return this.paramList;
	}
	protected addBody(param:Param){
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
		var onStartActionPublisher = new Event.OnStartAction.Publisher();
		var onsStartActionResponse:Event.OnStartAction.Response = this.publish(onStartActionPublisher);
		if(onsStartActionResponse.isAllow()) {
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	}
	public getRequestHandler():express.RequestHandler{
		return (req:express.Request, res:express.Response)=>{
			this.requestHandler(req,res);
		}
	}
}
export  = Action;