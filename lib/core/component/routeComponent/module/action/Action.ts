/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import RouteComponent = require("../../RouteComponent");
import IAction = require("./IAction");
import IActionMethod = require("./IActionMethod");
class Action extends RouteComponent implements IAction{
	private method:IActionMethod;
	private cb:express.RequestHandler;
	/**
	 * Określa czy dana akcja jest defaultowa. Jeśli tak to nie zwraca route
	 */
	private default:boolean;
	constructor(method:IActionMethod, name:string, options?:any){
		super(name,options);
		//console.log("Action.constructor method: "+ IActionMethod[method]);
		this.method = method;
		options = options || {};
		this.default = options.default || false;
	}
	public init():void{
		//console.log("Action.constructor method: "+ IActionMethod[this.method]);
		this.onInit();
	}
	protected onInit():void{

	}
	public getMethod():IActionMethod {
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