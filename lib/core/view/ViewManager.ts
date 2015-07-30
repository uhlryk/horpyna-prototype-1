/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Action = require("./../component/routeComponent/module/action/Action");
import Util = require("./../util/Util");
/**
 * Klasa odpowiada za zarządzanie widokami i renderowanie
 */
class ViewManager{
	private _renderView;
	private _dataView;
	private _defaultView;
	private debugger: Util.Debugger;
	constructor(){
		this.debugger = new Util.Debugger("view");
	}
	public debug(...args: any[]) {
		this.debugger.debug(args);
	}
	public setDefaultView(view:string){
		this._defaultView = view;
	}
	public render(req:express.Request, res:express.Response){
		var response: Action.Response = res['horpynaResponse'];
		if (req.query['view'] !== "json" && req['app']['get']("view engine")) {
			if (response.isRedirect()) {
				this.debug("redirect %s", response.getRedirectUrl());
				res.redirect(response.getRedirectStatus(), response.getRedirectUrl());
			} else {
				var view = response.getView();
				this.debug("render %s", view);
				this.debug(response.getData());
				res.render(view || this._defaultView, response.getData());
			}
		} else{
			if (response.isRedirect()) {
				response.addValue("redirect", {
					url: response.getRedirectUrl(),
					status: response.getRedirectStatus()
				});
			}
			this.debug("json");
			this.debug(response.getData());
			res.status(response.status).send(response.getData());
		}
	}
}
export = ViewManager;