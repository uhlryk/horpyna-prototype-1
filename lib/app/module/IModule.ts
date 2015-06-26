import IController = require("./../module/controller/IController");
interface IModule {
    init():void;
    getName():string;
    getRouteName():string;
    getControllerList():IController[];
}
export = IModule;