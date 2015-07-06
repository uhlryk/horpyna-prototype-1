import IModule = require("./IModule");
import RouteComponent = require("../RouteComponent");
import IAction = require("./action/IAction");
class Module extends RouteComponent implements IModule{
	private actionList:IAction[];
	private moduleList:IModule[];
	constructor(name:string, options?:any){
		super(name,options);
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