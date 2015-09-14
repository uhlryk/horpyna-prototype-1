/// <reference path="../../../../../typings/tsd.d.ts" />
import Core = require("../../../../index");
import express = require("express");
import Module = require("./Module");
import Action = require("./action/Action");
import Util = require("../../../util/Util");
/**
 * Moduł systemowy który zawiera akcję Home i Fallback
 */
class DefaultModule extends  Module{
	private _fallbackAction: Core.Action.BaseAction;
	private _homeAction: Core.Action.BaseAction;
	public onConstructor(){
		super.onConstructor();
		this._fallbackAction = new Action.BaseAction(this, Action.BaseAction.ALL, "final");
		this._fallbackAction.setActionHandler((request, response) => {
			response.setStatus(404);
			return Util.Promise.resolve();
		});
		this._homeAction = new Action.BaseAction(this, Action.BaseAction.ALL, "home");
		this._homeAction.setActionHandler((request, response) => {
			return Util.Promise.resolve();
		});
	}
	public getFallbackAction(): Core.Action.BaseAction {return this._fallbackAction;}
	public getHomeAction(): Core.Action.BaseAction {return this._homeAction;}
}
export = DefaultModule;