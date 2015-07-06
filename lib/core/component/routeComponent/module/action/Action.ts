/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
class Action extends RouteComponent {
	private method:string;

	private cb:express.RequestHandler;
	/**
	 * Określa czy dana akcja jest defaultowa. Jeśli tak to nie zwraca route
	 */
	private default:boolean;

	public static ALL:string = "all";
	public static POST:string = "post";
	public static GET:string = "get";
	public static PUT:string = "put";
	public static DELETE:string = "delete";

	constructor(method:string, name:string, options?:any){
		super(name, options);
		this.method = method;
		options = options || {};
		this.default = options.default || false;
	}
	public init():void{
		this.onInit();
	}
	protected onInit():void{

	}
	public getMethod():string {
		return this.method;
	}
	public set(cb:express.RequestHandler):void{
		this.cb = cb;
	}
	public getHandler():express.RequestHandler{
		return this.cb;
	}
}
export  = Action;