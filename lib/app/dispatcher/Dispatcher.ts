/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import IDispatcher = require("./idispatcher");
class Dispatcher implements IDispatcher{
    private router:express.Router;
    constructor() {

    }
    public setRouter(router:express.Router):void{
        this.router = router;
    }
    private baseRoute(){
        this.router.all("/", function (req, res) {
            res.sendStatus(200);
        });
    }
    private fallbackRoute(){
        this.router.use(function (req, res, next) {
            res.sendStatus(404);
        });
    }
    public run():void{
        this.baseRoute();
        this.fallbackRoute();
    }
}
export = Dispatcher;