/// <reference path="../../../../../../typings/tsd.d.ts" />
// import View = require("../../../../view/View");
import express = require("express");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
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
	private _valid: boolean;
	private _redirect: string;
	private _routePath: string;
	constructor(expressResponse:express.Response){
		this.status = 200;
		this._data = new Object();
		this._data['content'] = new Object();
		this.viewParam = new Object();
		this.expressResponse = expressResponse;
		this._routePath = null;
		this._valid = true;
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
	public set valid(v:boolean){
		this._valid = v;
	}
	public get valid():boolean{
		return this._valid;
	}
	public set view(name:string){
		this.viewParam['view'] = name;
	}
	public get view():string{
		return this.viewParam['view'];
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