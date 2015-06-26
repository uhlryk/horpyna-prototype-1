import IController = require("./IController");
import IAction = require("./../action/IAction");
class Controller implements IController{
    private name:string;
    private routeName:string;
    private options:any;
    private actionList:IAction[];
    constructor(name:string, options?:any){
        //console.log("Controller.constructor name: "+name);
        this.name = name;
        this.options = options || {};
        this.routeName = this.options.routeName || this.name;
        this.actionList = [];
    }
    public getRouteName():string{
        return this.routeName;
    }
    public init():void{
        //console.log("Controller.init name: "+this.name);
        this.onInit();
        this.initActions();
    }
    protected onInit():void{

    }
    public initActions(){
        for(var index in this.actionList){
            var action:IAction = this.actionList[index];
            action.init();
        };
    }
    protected addAction(action:IAction){
        this.actionList.push(action);
    }
    public getActionList():IAction[]{
        return this.actionList;
    }
}
export = Controller;