
import IDispatcher = require("./dispatcher/IDispatcher");
import IModuleManager = require("./moduleManager/IModuleManager");

class FrontController {
    public static DISPATCHER_NONE: string = "Need 'dispatcher'";
    public static MODULE_MANAGER_NONE: string = "Need 'moduleManager'";

    private dispatcher:IDispatcher;
    private moduleManager:IModuleManager.IModuleManager;
    constructor() {

    }
    public setDispatcher(dispatcher:IDispatcher):void{
        this.dispatcher = dispatcher;
    }
    public setModuleManager(moduleManager:IModuleManager.IModuleManager):void{
        this.moduleManager = moduleManager;
    }
    public getModuleManager():IModuleManager.IModuleManager{
        return this.moduleManager;
    }
    private setup():void{
        if(this.dispatcher == undefined){
            throw new Error(FrontController.DISPATCHER_NONE);
        }
        if(this.moduleManager == undefined){
            throw new Error(FrontController.MODULE_MANAGER_NONE);
        }
    }
    public run():void{
        this.setup();
        //this.moduleManager.
        this.dispatcher.run();
    }
}
export = FrontController;