/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
class Action extends RouteComponent {
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
		this.setRequestHandler(this.requestHandler);
	}
	public init():void{
		this.onInit();
	}
	protected onInit():void{

	}
	public getMethod():string {
		return this.method;
	}
	protected requestHandler(req:express.Request, res:express.Response){
		res.sendStatus(400);
	}
	public setRequestHandler(cb:express.RequestHandler):void{
		this.cb = cb;
	}
	public getRequestHandler():express.RequestHandler{
		return this.cb;
	}
}
export  = Action;