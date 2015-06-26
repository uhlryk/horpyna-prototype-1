/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Module = require("./Module");
import SimpleController = require("./controller/SimpleController");
class SimpleModule extends  Module{
    public controller:SimpleController;
    public onInit(){
        super.onInit();
        this.controller = new SimpleController("index");
        this.controller.get = this.get;
        this.controller.post = this.post;
        this.controller.put = this.put;
        this.controller.delete = this.delete;
        this.addController(this.controller);
    }
    protected get(req:express.Request, res:express.Response){
        res.sendStatus(400);
    }
    protected post(req:express.Request, res:express.Response){
        res.sendStatus(400);
    }
    protected put(req:express.Request, res:express.Response){
        res.sendStatus(400);
    }
    protected delete(req:express.Request, res:express.Response){
        res.sendStatus(400);
    }
}
export = SimpleModule;