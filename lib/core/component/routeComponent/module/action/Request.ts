/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import Util = require("./../../../../util/Util");
import FieldType = require("./field/FieldType");
class Request{
	public allFieldList:Object;
	private expressRequest:express.Request;
	// private _action:BaseAction;
	private _logger: Util.Logger;
	constructor(expressRequest:express.Request){
		this.expressRequest = expressRequest;
		this.allFieldList = new Object();
		this.allFieldList[FieldType.PARAM_FIELD] = new Object();
		this.allFieldList[FieldType.QUERY_FIELD] = new Object();
		this.allFieldList[FieldType.BODY_FIELD] = new Object();
		this.allFieldList[FieldType.APP_FIELD] = new Object();
		this.allFieldList[FieldType.HEADER_FIELD] = new Object();
		this.allFieldList[FieldType.FILE_FIELD] = new Object();
	}
	/**
	 * Na podstawie express requesta wyciąga Horpyna request
	 */
	public static ExpressToRequest(req: express.Request): Request{
		return req['horpynaRequest'];
	}
	public set logger(logger:Util.Logger){
		this._logger = logger;
	}
	public get logger():Util.Logger{
		return this._logger;
	}
	public getExpressRequest():express.Request{
		return this.expressRequest;
	}
	public addField(type: string, name: string, value: any) {
		this.allFieldList[type][name] = value;
	}
	public getField(type: string, name: string): any {
		return this.allFieldList[type][name];
	}
	public getFieldList(type: string): any {
		return this.allFieldList[type];
	}
	/**
	 * Zwraca listę pól parametrów (PARAM_FIELD) nadpisaną przez pola aplikacji(APP_FIELD)
	 * @return {any} mapa klucz:wartość
	 */
	public getParamAppFieldList():any{
		var appList = this.getFieldList(FieldType.APP_FIELD);
		var paramList = this.getFieldList(FieldType.PARAM_FIELD);
		/**
		 * APP_FIELD ma priorytet nad paramList. Może go nadpisać
		 */
		for (var key in paramList) {
			var val = appList[key];
			if (val === undefined) {
				appList[key] = paramList[key];
			}
		}
		return appList;
	}
}
export = Request;