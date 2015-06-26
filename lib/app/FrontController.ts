
import Dispatcher = require("./dispatcher/Dispatcher");
import ModuleManager = require("./moduleManager/ModuleManager");

class FrontController {
    public static DISPATCHER_NONE: string = "Need 'dispatcher'";
    public static MODULE_MANAGER_NONE: string = "Need 'moduleManager'";

    private dispatcher: Dispatcher;
    private moduleManager: ModuleManager;
    constructor() {

    }
    public setDispatcher(dispatcher: Dispatcher):void{
        this.dispatcher = dispatcher;
    }
    public setModuleManager(moduleManager:ModuleManager):void{
        this.moduleManager = moduleManager;
    }
    public getModuleManager():ModuleManager{
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
        this.moduleManager.initModules();
        this.dispatcher.createRoutes(this.moduleManager.getModuleList());
    }
}
export = FrontController;