import IModule = require("./IModule");
import IAction = require("./action/IAction");
class Module implements IModule{
	private name:string;
	private routeName:string;
	private options:any;
	//private controllerList:IController[];
	private actionList:IAction[];
	private moduleList:IModule[];
	constructor(name:string, options?:any){
		//console.log("Module.constructor name: "+name);
		this.name = name;
		this.options = options || {};
		this.routeName = this.options.routeName || this.name;
		this.actionList = [];
		this.moduleList = [];
	}
	public init():void{
		this.onInit();
		this.initModules();
		this.initActions();
	}
	public initModules(){
		for(var index in this.moduleList){
			var childModule:IModule = this.moduleList[index];
			childModule.init();
		};
	}
	public initActions(){
		for(var index in this.actionList){
			var action:IAction = this.actionList[index];
			action.init();
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
	//public getControllerList():IController[]{
	//	return this.controllerList;
	//}
	/**
	 * It should be available in inheriting modules but not outside. This method should be use only in
	 * onInit method. Maybe throw errow when use in other situations
	 */
	//protected addController(controller:IController){
	//	this.controllerList.push(controller);
	//}
	protected addAction(action:IAction){
	this.actionList.push(action);
}
	public getActionList():IAction[]{
		return this.actionList;
	}
	protected addModule(module:IModule){
		this.moduleList.push(module);
	}
	public getModuleList():IModule[]{
		return this.moduleList;
	}
}
export = Module;