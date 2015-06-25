/// <reference path="../../typings/tsd.d.ts" />
/**
 * Jest to wyższy poziom abstrakcji frontControllera,
 * na tym poziomie może wyglądać jak wrapper tylko.
 * Ale docelowo będą interfejsy dla RouteControllera i ModuleControllera
 * i na tym poziomie będzie można je zmieniać i wstawiać do frontControllera
 */
import express = require("express");
import FrontController = require("./FrontController");
import IDispatcher = require("./dispatcher/IDispatcher");
import Dispatcher = require("./dispatcher/Dispatcher");
import IModuleManager = require("./moduleManager/IModuleManager");
import ModuleManager = require("./moduleManager/ModuleManager");
import IModule = require("./module/IModule");
class Application {
    public static MODULE_PATH_NONE: string = "Need 'module path'";

    private frontController:FrontController;
    private dispatcher:IDispatcher;
    private moduleManager:IModuleManager.IModuleManager;
    constructor() {
        console.log("Application.constructor");
        this.frontController = new FrontController();
        this.dispatcher = new Dispatcher();
        this.moduleManager = new ModuleManager();
        this.frontController.setDispatcher(this.dispatcher);
        this.frontController.setModuleManager(this.moduleManager);
    }
    public addModule(name:string, moduleInstance:IModule):void{
        this.moduleManager.addModule(name,moduleInstance);
    }
    public run():express.Router{
        var router:express.Router = express.Router();
        this.dispatcher.setRouter(router);
        this.frontController.run();
        return router;
    }
}
export = Application;