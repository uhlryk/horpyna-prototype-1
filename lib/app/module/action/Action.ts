/// <reference path="../../../../typings/tsd.d.ts" />
import express = require("express");
import IAction = require("./IAction");
import IActionMethod = require("./IActionMethod");
class Action implements IAction{
    private method:IActionMethod;
    private cb:express.RequestHandler;
    constructor(method:IActionMethod){
        //console.log("Action.constructor method: "+ IActionMethod[method]);
        this.method = method;
    }
    public init():void{
        //console.log("Action.constructor method: "+ IActionMethod[this.method]);
        this.onInit();
    }
    protected onInit():void{

    }
    public getMethod():IActionMethod {
        return this.method;
    }
    public set(cb:express.RequestHandler):void{
        this.cb = cb;
    }
    public getHandler():express.RequestHandler{
        return this.cb;
    }
}
export  = Action;