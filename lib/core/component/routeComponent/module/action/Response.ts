/// <reference path="../../../../../../typings/tsd.d.ts" />
import View = require("../../../../view/View");
import express = require("express");
class Response{
	public status:number;
	public view:any;
	private data:Object;
	private expressResponse:express.Response;
	constructor(expressResponse:express.Response, viewClass){
		this.status = 200;
		this.data = new Object();
		this.expressResponse = expressResponse;
		this.view = new viewClass(this.expressResponse);
	}
	public setStatus(value:number){
		this.status = value;
	}
	public getStatus():number{
		return this.status;
	}
	public render(){
		this.view.setStatus(this.status);
		this.view.setData(this.data);
		this.view.render();
	}
	public getView():any{
		return this.view;
	}
	public addValue(name:string, value:any){
		this.data[name] = value;
	}
	public addContent(value:any){
		this.data['content'] = value;
	}
	public getData(name?:string):Object{
		if(name){
			return this.data[name];
		}
		return this.data;
	}
}
export = Response;