import IAction = require("./../action/IAction");
interface IController{
    getRouteName():string;
    init():void;
    getActionList():IAction[];
}
export = IController;