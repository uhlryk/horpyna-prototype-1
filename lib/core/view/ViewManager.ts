/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Action = require("./../component/routeComponent/module/action/Action");
/**
 * Klasa odpowiada za zarządzanie widokami i renderowanie
 */
class ViewManager{
	private _renderView;
	private _dataView;
	constructor(){

	}
	public render(req:express.Request, res:express.Response){
		var response: Action.Response = res['horpynaResponse'];
		if (req.query['view'] !== "json" && req['app']['get']("view engine")) {
			if (response.isRedirect()) {
				res.redirect(response.getRedirectStatus(), response.getRedirectUrl());
			} else {
				res.render(response.getParam('view'), response.getData());
			}
		} else{
			if (response.isRedirect()) {
				response.addValue("redirect", {
					url: response.getRedirectUrl(),
					status: response.getRedirectStatus()
				});
			}
			res.status(response.status).send(response.getData());
		}
	}
}
export = ViewManager;