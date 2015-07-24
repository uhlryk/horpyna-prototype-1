/// <reference path="../../../../../../typings/tsd.d.ts" />
import View = require("../../../../view/View");
import express = require("express");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
/**
 * Obiekt z odpowiedzią na requesta. Jest to wrapper na express.Response
 */
class Response{
	public status:number;
	/**
	 * Obiekt widoku. Widok odpowiada za render do przeglądarki. Może to być JadeView, JsonView
	 */
	public view:any;
	/**
	 * DOdatkowe parametry widoku. Np template
	 * @type {Object}
	 */
	private viewParam: Object;
	/**
	 * dane do widoku do zrenderowania, w przypadku json jest to output
	 * @type {Object}
	 */
	private data:Object;
	private expressResponse:express.Response;
	private action:BaseAction;
	private _logger: Util.Logger;
	private _allow: boolean;
	private _redirect: string;
	constructor(expressResponse:express.Response){
		this.status = 200;
		this.data = new Object();
		this.viewParam = new Object();
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
	public setRedirect(url: string, status?: number){
		this._redirect = url;
		if(status) {
			this.setStatus(status);
		} else {
			this.setStatus(302);
		}
	}
	public isRedirect():boolean{
		if (this._redirect) {
			return true;
		}
		return false;
	}
	// public getRedirect():string{
	// 	return this._redirect;
	// }
	public redirect() {
		this.expressResponse.redirect(this.status, this._redirect);
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
			this.view.status = this.status;
			this.view.data = this.data;
			this.view.param = this.viewParam;
			this.view.render();
		} else{
			this.expressResponse.status(this.status).send(this.data);
		}
	}
	public getView():any{
		return this.view;
	}
	public addViewParam(name:string, value:any){
		this.viewParam[name] = value;
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