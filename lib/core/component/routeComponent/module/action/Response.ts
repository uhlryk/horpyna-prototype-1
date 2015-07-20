/// <reference path="../../../../../../typings/tsd.d.ts" />
import View = require("../../../../view/View");
import express = require("express");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
class Response{
	public status:number;
	public view:any;
	private data:Object;
	private expressResponse:express.Response;
	private action:BaseAction;
	private _logger: Util.Logger;
	private _allow: boolean;
	constructor(expressResponse:express.Response){
		this.status = 200;
		this.data = new Object();
		this.expressResponse = expressResponse;
	}
	public setAction(action: BaseAction) {
		this.action = action;
	}

	public setViewClass(viewClass) {
		this.view = new viewClass(this.expressResponse);
	}
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	public setStatus(value:number){
		this.status = value;
	}
	public getStatus():number{
		return this.status;
	}
	public set allow(isAllow:boolean){
		this._allow = isAllow;
	}
	public get allow():boolean{
		return this._allow;
	}
	public render(){
		if (this.view) {
			this.view.setStatus(this.status);
			this.view.setData(this.data);
			this.view.render();
		} else{
			this.expressResponse.status(this.status).send(this.data);
		}
	}
	public getView():any{
		return this.view;
	}
	public addValue(name:string, value:any){
		this.data[name] = value;
	}
	public setContent(value:any){
		this.data['content'] = value;
	}
	public getData(name?:string):Object{
		if(name){
			return this.data[name];
		}
		return this.data;
	}
	public getAction():BaseAction{
		return this.action;
	}
}
export = Response;