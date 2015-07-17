/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
class Request{
	public paramList:Object;
	public queryList:Object;
	public bodyList:Object;
	private expressRequest:express.Request;
	private action:BaseAction;
	private _logger: Util.Logger;
	constructor(action:BaseAction, expressRequest:express.Request){
		this.expressRequest = expressRequest;
		this.paramList = new Object();
		this.queryList = new Object();
		this.bodyList = new Object();
		this.action = action;
	}
	public set logger(logger:Util.Logger){
		this._logger = logger;
	}
	public get logger():Util.Logger{
		return this._logger;
	}
	public addParam(name:string,value:any){this.paramList[name] = value;}
	public getParam(name:string):any{return this.paramList[name];}
	public removeParam(name:string){
		delete this.paramList[name];
	}
	public getParamList():any{return this.paramList;}
	public addQuery(name:string,value:any){this.queryList[name] = value;}
	public getQuery(name:string):any{return this.queryList[name];}
	public removeQuery(name:string){
		delete this.queryList[name];
	}
	public getQueryList():any{return this.queryList;}
	public addBody(name:string,value:any){this.bodyList[name] = value;}
	public getBody(name:string):any{return this.bodyList[name];}
	public removeBody(name:string){
		delete this.bodyList[name];
	}
	public getBodyList():any{return this.bodyList;}
	public getAction():BaseAction{
		return this.action;
	}
}
export = Request;