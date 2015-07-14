/// <reference path="../../../../../../typings/tsd.d.ts" />
import View = require("../../../../view/View");
import express = require("express");
class Response{
	public status:number;
	public view:View.BaseView;
	private expressResponse:express.Response;
	constructor(expressResponse:express.Response, viewClass){
		this.status = 200;
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
		this.view.render();
	}
	public setView(view:View.BaseView){
		this.view = view;
	}
	public getView():View.BaseView{
		return this.view;
	}
	public addValue(name:string, value:any){
		this.view.addValue(name, value);
	}
	public addContent(value:any){
		this.view.addContentValue(value);
	}
}
export = Response;