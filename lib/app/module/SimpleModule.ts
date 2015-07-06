/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("../../core/component/routeComponent/module/Module");
import Action = require("../../core/component/routeComponent/module/action/Action");

class SimpleModule extends  Module{
	public onInit(){
		super.onInit();
		var getAction = new Action(Action.GET, "List");
		getAction.set(this.get);
		this.addAction(getAction);
		var postAction = new Action(Action.POST, "Edit");
		postAction.set(this.post);
		this.addAction(postAction);
		var putAction = new Action(Action.PUT, "Update");
		putAction.set(this.put);
		this.addAction(putAction);
		var deleteAction = new Action(Action.DELETE, "Delete");
		deleteAction.set(this.delete);
		this.addAction(deleteAction);
	}
	public get(req:express.Request, res:express.Response){
		res.sendStatus(400);
	}
	public post(req:express.Request, res:express.Response){
		res.sendStatus(400);
	}
	public put(req:express.Request, res:express.Response){
		res.sendStatus(400);
	}
	public delete(req:express.Request, res:express.Response){
		res.sendStatus(400);
	}
}
export = SimpleModule;