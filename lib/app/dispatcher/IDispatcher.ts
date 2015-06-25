/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
interface IDispatcher{
    setRouter(router:express.Router):void;
    run():void;
}
export = IDispatcher;