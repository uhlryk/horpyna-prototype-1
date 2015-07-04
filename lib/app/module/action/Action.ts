/// <reference path="../../../../typings/tsd.d.ts" />
import express = require("express");
import IAction = require("./IAction");
import IActionMethod = require("./IActionMethod");
class Action implements IAction{
	private method:IActionMethod;
	private name:string;
	private routeName:string;
	private options:any;
	private cb:express.RequestHandler;
	/**
	 * Określa czy dana akcja jest defaultowa. Jeśli tak to nie zwraca route
	 */
	private default:boolean;
	constructor(method:IActionMethod, name:string, options?:any){
		//console.log("Action.constructor method: "+ IActionMethod[method]);
		this.method = method;
		this.name = name;
		this.options = options || {};
		this.routeName = this.options.routeName || this.name;
		this.default = this.options.default || false;
	}
	public init():void{
		//console.log("Action.constructor method: "+ IActionMethod[this.method]);
		this.onInit();
	}
	protected onInit():void{

	}
	public getRouteName():string{
		return this.routeName;
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