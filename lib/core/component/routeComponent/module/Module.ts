import RouteComponent = require("../RouteComponent");
import Event = require("../../event/Event");
import Action = require("./action/Action");
import Model = require("./model/Model");
class Module extends RouteComponent{
	private actionList:Action[];
	private defaultActionList:Action[];//może być więcej niż jedna akcja domyślna więc są one jako lista
	private modelList:Model[];
	private defaultModel:Model;
	private moduleList:Module[];
	private defaultModule : Module;
	private subscriberList:Event.BaseEvent.Subscriber[];
	constructor(name:string){
		super(name);
		this.actionList = [];
		this.defaultActionList = [];
		this.moduleList = [];
		this.modelList = [];
		this.subscriberList = [];
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
	protected addAction(action:Action,isDefault?:boolean){
		this.actionList.push(action);
		action.setParent(this);
		if(isDefault === true){
			this.defaultActionList.push(action);
		}
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
	public getDefaultActionList():Action[]{
		return this.defaultActionList;
	}
	protected addModule(module:Module,isDefault?:boolean){
		this.moduleList.push(module);
		module.setParent(this);
		if(isDefault === true){
			this.defaultModule = module;
		}
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
	public getDefaultModule():Module{
		return this.defaultModule;
	}
	protected addModel(model:Model,isDefault?:boolean){
		this.modelList.push(model);
		model.setParent(this);
		if(isDefault === true){
			this.defaultModel = model;
		}
	}
	public getModelList():Model[]{
		return this.modelList;
	}
	public getDefaultModel():Model{
		return this.defaultModel;
	}
	public getModel(name:string):Model{
		for(var index in this.modelList){
			var model:Model = this.modelList[index];
			if(model.getName() === name){
				return model;
			}
		}
	}
	public subscribe(subscriber:Event.BaseEvent.Subscriber){
		this.subscriberList.push(subscriber);
	}
	protected onSendPublisher(data:any):any{
		for(var index in this.subscriberList){
			var subscriber:Event.BaseEvent.Subscriber = this.subscriberList[index];
			if(subscriber.isPublic() === false) {
				var callback = subscriber.getCallback();
				var dataResponse:Event.BaseEvent.Data = new subscriber.dataObject(subscriber.getType(), data);
				callback(dataResponse);
				data = dataResponse.getRawData();
			}
		}
		return data;
	}
	public broadcastPublisher(data:any):any{
		for(var index in this.subscriberList){
			var subscriber:Event.BaseEvent.Subscriber = this.subscriberList[index];
			if(subscriber.isPublic() === true) {
				var callback = subscriber.getCallback();
				var dataResponse:Event.BaseEvent.Data = new subscriber.dataObject(subscriber.getType());
				dataResponse.setRawData(data);
				callback(dataResponse);
				data = dataResponse.getRawData();
			}
		}
		for(var index in this.moduleList){
			var module:Module = this.moduleList[index];
			data = module.broadcastPublisher(data);
		}
		return data;
	}
}
export = Module;