/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
import Param = require("./param/Param");
class Action extends RouteComponent {
	private paramList:Param[];
	private queryList:Param[];
	private bodyList:Param[];
	private method:string;
	private cb:express.RequestHandler;
	public static ALL:string = "all";
	public static POST:string = "post";
	public static GET:string = "get";
	public static PUT:string = "put";
	public static DELETE:string = "delete";

	constructor(method:string, name:string, options?:any){
		super(name, options);
		this.method = method;
		this.paramList = [];
		this.queryList = [];
		this.bodyList = [];
		this.setRequestHandler(this.requestHandler);
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
	protected requestHandler(req:express.Request, res:express.Response){
		res.sendStatus(200);
	}
	public setRequestHandler(cb:express.RequestHandler):void{
		this.cb = cb;
	}
	public getRequestHandler():express.RequestHandler{
		return this.cb;
	}
}
export  = Action;