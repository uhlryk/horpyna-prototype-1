/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
class Request{
	public paramList:Object;
	public queryList:Object;
	public bodyList:Object;
	private expressRequest:express.Request;
	constructor(expressRequest:express.Request){
		this.expressRequest = expressRequest;
		this.paramList = new Object();
		this.queryList = new Object();
		this.bodyList = new Object();
	}
	public addParam(name:string,value:any){this.paramList[name] = value;}
	public getParam(name:string):any{return this.paramList[name];}
	public getParamList():any{return this.paramList;}
	public addQuery(name:string,value:any){this.queryList[name] = value;}
	public getQuery(name:string):any{return this.queryList[name];}
	public getQueryList():any{return this.queryList;}
	public addBody(name:string,value:any){this.bodyList[name] = value;}
	public getBody(name:string):any{return this.bodyList[name];}
	public getBodyList():any{return this.bodyList;}
	
}
export = Request;