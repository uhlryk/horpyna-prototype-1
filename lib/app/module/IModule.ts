//import IController = require("./../module/controller/IController");
import IAction = require("./action/IAction");
interface IModule {
	init():void;
	getName():string;
	getRouteName():string;
	getActionList():IAction[];
	getModuleList():IModule[];
	//getControllerList():IController[];
}
export = IModule;