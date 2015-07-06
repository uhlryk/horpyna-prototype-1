//import IController = require("./../module/controller/IController");
import IAction = require("./action/IAction");
interface IModule {
	init():void;
	getName():string;
	getRoute():string;
	getActionList():IAction[];
	getModuleList():IModule[];
	//getControllerList():IController[];
}
export = IModule;