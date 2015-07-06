import RouteComponent = require("../RouteComponent");
import Action = require("./action/Action");
class Module extends RouteComponent{
	private actionList:Action[];
	private moduleList:Module[];
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
			var childModule:Module = this.moduleList[index];
			childModule.init();
		};
	}
	public initActions(){
		for(var index in this.actionList){
			var action:Action = this.actionList[index];
			action.init();
		};
	}
	/**
	 * Gdy moduł oparty jest na innym i go rozszerzamy to w tym miejscu najlepiej dodać do niego strukturę
	 * Method is call in init which is called id in ModuleManager.run() method
	 */
	protected onInit(){

	}
	protected addAction(action:Action){
		this.actionList.push(action);
		action.setParent(this);
	}
	public getActionList():Action[]{
		return this.actionList;
	}
	protected addModule(module:Module){
		this.moduleList.push(module);
		module.setParent(this);
	}
	public getModuleList():Module[]{
		return this.moduleList;
	}
}
export = Module;