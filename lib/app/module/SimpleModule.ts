/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("../../core/component/routeComponent/module/Module");
import MethodAction = require("../../core/component/routeComponent/module/action/MethodAction");
import IActionMethod = require("../../core/component/routeComponent/module/action/IActionMethod");
class SimpleModule extends  Module{
	public onInit(){
		super.onInit();
		var getAction = new MethodAction.Get("List");
		getAction.set(this.get);
		this.addAction(getAction);
		var postAction = new MethodAction.Post("Edit");
		postAction.set(this.post);
		this.addAction(postAction);
		var putAction = new MethodAction.Put("Update");
		putAction.set(this.put);
		this.addAction(putAction);
		var deleteAction = new MethodAction.Delete("Delete");
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