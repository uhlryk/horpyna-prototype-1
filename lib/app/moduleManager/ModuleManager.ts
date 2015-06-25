/// <reference path="../../../typings/tsd.d.ts" />
import IModuleManager = require("./IModuleManager");
import IModule = require("./../module/IModule");
import fs = require("fs");
import path = require("path");

class ModuleManager implements IModuleManager.IModuleManager{
    private list:IModuleManager.ModuleList;
    constructor() {
        this.list = {};
    }
    public addModule(name:string, moduleInstance:IModule) : void{
        this.list[name] = moduleInstance;
    }
    public getModule(name:string){
        return this.list[name];
    }
    public getList() : IModuleManager.ModuleList{
        return this.list;
    }
}
export = ModuleManager;