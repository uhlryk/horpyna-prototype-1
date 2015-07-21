/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
import ParamType = require("./param/ParamType");
class Request{
	public allParamList:Object;
	private expressRequest:express.Request;
	private action:BaseAction;
	private _logger: Util.Logger;
	constructor(expressRequest:express.Request){
		this.expressRequest = expressRequest;
		this.allParamList = new Object();
		this.allParamList[ParamType.PARAM_URL] = new Object();
		this.allParamList[ParamType.PARAM_QUERY] = new Object();
		this.allParamList[ParamType.PARAM_BODY] = new Object();
		this.allParamList[ParamType.PARAM_APP] = new Object();
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
	public addParam(type: string, name: string, value: any) {
		if (!this.allParamList[type]){
			this.allParamList[type] = new Object();
		}
		this.allParamList[type][name] = value;
	}
	public getParam(type: string, name: string): any {
		return this.allParamList[type][name];
	}
	public getParamList(type: string): any {
		return this.allParamList[type];
	}
}
export = Request;