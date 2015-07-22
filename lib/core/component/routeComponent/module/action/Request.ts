/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
import FieldType = require("./field/FieldType");
class Request{
	public allFieldList:Object;
	private expressRequest:express.Request;
	private action:BaseAction;
	private _logger: Util.Logger;
	constructor(expressRequest:express.Request){
		this.expressRequest = expressRequest;
		this.allFieldList = new Object();
		this.allFieldList[FieldType.PARAM_FIELD] = new Object();
		this.allFieldList[FieldType.QUERY_FIELD] = new Object();
		this.allFieldList[FieldType.BODY_FIELD] = new Object();
		this.allFieldList[FieldType.APP_FIELD] = new Object();
	}
	public setAction(action: BaseAction) {
		this.action = action;
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
		if (!this.allFieldList[type]){
			this.allFieldList[type] = new Object();
		}
		this.allFieldList[type][name] = value;
	}
	public getField(type: string, name: string): any {
		return this.allFieldList[type][name];
	}
	public getFieldList(type: string): any {
		return this.allFieldList[type];
	}
}
export = Request;