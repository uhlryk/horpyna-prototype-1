/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Action = require("./../component/routeComponent/module/action/Action");
import Element = require("./../Element");
/**
 * Klasa odpowiada za zarządzanie widokami i renderowanie
 */
class ViewManager extends Element{
	constructor(){
		super();
		this.initDebug("view");
	}
	public render(req:express.Request, res:express.Response){
		var response: Action.Response = res['horpynaResponse'];
		if (response.download){
			this.debug("show file %s", response.download.filename);
			res.download(response.download.path, response.download.filename, response.download.fn);
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