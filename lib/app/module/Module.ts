import IModule = require("./IModule");
import IController = require("./controller/IController");
class Module implements IModule{
    private name:string;
    private routeName:string;
    private options:any;
    private controllerList:IController[];
    constructor(name:string, options?:any){
        //console.log("Module.constructor name: "+name);
        this.name = name;
        this.options = options || {};
        this.routeName = this.options.routeName || this.name;
        this.controllerList = [];
    }
    public init():void{
        //console.log("Module.constructor name: "+this.name);
        this.onInit();
        this.initControllers();
    }
    public initControllers(){
        for(var index in this.controllerList){
            var controller:IController = this.controllerList[index];
            controller.init();
        };
    }
    /**
     * Gdy moduł oparty jest na innym i go rozszerzamy to w tym miejscu najlepiej dodać do niego strukturę
     * Method is call in init which is called id in ModuleManager.run() method
     */
    protected onInit(){

    }
    public getName():string {
        return this.name;
    }
    /**
     * Zwraca nazwę route która powinna wskazywać na ten obiekt
     */
    public getRouteName():string{
        return this.routeName;
    }
    public getControllerList():IController[]{
        return this.controllerList;
    }
    /**
     * It should be available in inheriting modules but not outside. This method should be use only in
     * onInit method. Maybe throw errow when use in other situations
     */
    protected addController(controller:IController){
        this.controllerList.push(controller);
    }

}
export = Module;