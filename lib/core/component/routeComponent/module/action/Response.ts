/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import Util = require("./../../../../util/Util");
import BaseAction = require("./BaseAction");
/**
 * Obiekt z odpowiedzią na requesta. Jest to wrapper na express.Response
 */
class Response{
	public status:number;
	private _redirectStatus:number;
	/**
	 * DOdatkowe parametry widoku. Np template
	 */
	private viewParam: Object;
	/**
	 * dane do widoku do zrenderowania, w przypadku json jest to output
	 */
	private _data:Object;
	private expressResponse:express.Response;
	private _logger: Util.Logger;
	private _allow: boolean;
	private _forward: BaseAction;
	private _redirect: string;
	private _routePath: string;
	private _download: { path: string; filename?: string; fn?:(err)=>void };
	constructor(expressResponse:express.Response){
		this.status = 200;
		this._data = new Object();
		this._data['content'] = new Object();
		this.viewParam = new Object();
		this.expressResponse = expressResponse;
		this._routePath = null;
		this._allow = true;
	}
	/**
	 * Na podstawie express requesta wyciąga Horpyna request
	 */
	public static ExpressToResponse(res: express.Response): Response {
		return res['horpynaResponse'];
	}
	public getExpressResponse():express.Response{
		return this.expressResponse;
	}
	public set routePath(v : string) {
		this._routePath = v;
	}
	public get routePath() : string {
		return this._routePath;
	}
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	public setDownload(path: string, filename?: string, fn?: (err) => void) {
		this._download = <{ path: string; filename?: string; fn?: (err) => void }>{ path: path };
		if (filename) {
			this._download.filename = filename;
		}
		if (fn) {
			this._download.fn = fn;
		}
	}
	public get download(): { path: string; filename?: string; fn?: (err) => void } {
		return this._download;
	}
	public setRedirect(url: string, status?: number){
		this._redirect = url;
		if(status) {
			this._redirectStatus = status;
		} else {
			this._redirectStatus = 302;
		}
	}
	public isRedirect():boolean{
		if (this._redirect) {
			return true;
		}
		return false;
	}
	public getRedirectUrl():string {
		return this._redirect;
	}
	/**
	 * zwraca status jaki ma mieć redirect. Ponieważ status zwracanej wiadomości nie musi być równy statusowi redirecta
	 * Jeśli zwracamy json, to nie robimy redirecta tylko normalny status, a redirect jest informacją w treści
	 * @return {number} [description]
	 */
	public getRedirectStatus(): number {
		return this._redirectStatus;
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
	public setForwardAction(action: BaseAction) {
		this._forward = action;
	}
	public getForwardAction():BaseAction{
		return this._forward;
	}
	public addValue(name:string, value:any){
		this._data[name] = value;
	}
	public set content(value:any){
		this._data['content'] = value;
	}
	public get content():any{
		return this._data['content'];
	}
	public getData(name?:string):Object{
		if(name){
			return this._data[name];
		}
		return this._data;
	}
}
export = Response;