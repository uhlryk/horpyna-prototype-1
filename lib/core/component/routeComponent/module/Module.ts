import RouteComponent = require("../RouteComponent");
import Action = require("./action/Action");
import Model = require("./model/Model");
class Module extends RouteComponent{
	private actionList:Action[];
	private modelList:Model[];
	private moduleList:Module[];
	constructor(name:string, options?:any){
		super(name,options);
		this.actionList = [];
		this.moduleList = [];
		this.modelList = [];
	}
	public init():void{
		this.onInit();
		this.initModules();
		this.initActions();
		this.initModels();
	}
	public initModules(){
		for(var index in this.moduleList){
			var childModule:Module = this.moduleList[index];
			childModule.init();
		};
	}
	public initModels(){
		for(var index in this.modelList){
			var model:Model = this.modelList[index];
			model.init();
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
	public getAction(name:string):Action{
		for(var index in this.actionList){
			var action:Action = this.actionList[index];
			if(action.getName() === name){
				return action;
			}
		}
	}
	protected addModule(module:Module){
		this.moduleList.push(module);
		module.setParent(this);
	}
	public getModuleList():Module[]{
		return this.moduleList;
	}
	public getModule(name:string):Module{
		for(var index in this.moduleList){
			var module:Module = this.moduleList[index];
			if(module.getName() === name){
				return module;
			}
		}
	}
	protected addModel(model:Model){
		this.modelList.push(model);
		model.setParent(this);
	}
	public getModelList():Model[]{
		return this.modelList;
	}
	public getModel(name:string):Model{
		for(var index in this.modelList){
			var model:Model = this.modelList[index];
			if(model.getName() === name){
				return model;
			}
		}
	}
}
export = Module;