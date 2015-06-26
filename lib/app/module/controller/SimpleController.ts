/// <reference path="../../../../typings/tsd.d.ts" />
import express = require("express");
import Controller = require("./Controller");
import MethodAction = require("./../action/MethodAction");
import IActionMethod = require("./../action/IActionMethod");
class SimpleController extends  Controller{
    public onInit(){
        super.onInit();
        var getAction = new MethodAction.Get();
        getAction.set(this.get);
        this.addAction(getAction);
        var postAction = new MethodAction.Post();
        postAction.set(this.post);
        this.addAction(postAction);
        var putAction = new MethodAction.Put();
        putAction.set(this.put);
        this.addAction(putAction);
        var deleteAction = new MethodAction.Delete();
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
export = SimpleController;