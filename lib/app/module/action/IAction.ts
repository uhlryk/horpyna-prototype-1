/// <reference path="../../../../typings/tsd.d.ts" />
import express = require("express");
import IActionMethod = require("./IActionMethod");

interface IAction{
	getMethod():IActionMethod;
	getRouteName():string;
	init():void;
	set(cb:express.RequestHandler):void;
	getHandler():express.RequestHandler;
}
export  = IAction;