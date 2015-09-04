/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Action = require("./../component/routeComponent/module/action/Action");
import Util = require("./../util/Util");
import Element = require("./../Element");
/**
 * Klasa odpowiada za zarządzanie widokami i renderowanie
 */
class ViewManager extends Element{
	private _renderView;
	private _dataView;
	private _defaultView;
	constructor(){
		super();
		this.initDebug("view");
	}
	public set defaultView(view:string){
		this._defaultView = view;
	}
	public render(req:express.Request, res:express.Response){
		var response: Action.Response = res['horpynaResponse'];
		if (response.download){
			this.debug("show file %s", response.download.filename);
			res.download(response.download.path, response.download.filename, response.download.fn);
		} else if (req.query['view'] !== "json" && req['app']['get']("view engine")) {
			if (response.isRedirect()) {
				this.debug("redirect %s", response.getRedirectUrl());
				res.redirect(response.getRedirectStatus(), response.getRedirectUrl());
			} else {
				var view = response.view;
				this.debug("render %s %s", view, JSON.stringify(response.getData()));
				res.status(response.status).render(view || this._defaultView, response.getData());
			}
		} else{
			if (response.isRedirect()) {
				response.addValue("redirect", {
					url: response.getRedirectUrl(),
					status: response.getRedirectStatus()
				});
			}
			this.debug("json %s", JSON.stringify(response.getData()));
			res.status(response.status).send(response.getData());
		}
	}
}
export = ViewManager;