import RouteComponent = require("../RouteComponent");
import Event = require("../../event/Event");
import Action = require("./action/Action");
import Model = require("./model/Model");
import Util = require("../../../util/Util");
class Module extends RouteComponent{
	private actionList:Action.BaseAction[];
	// private defaultActionList:Action.BaseAction[];//może być więcej niż jedna akcja domyślna więc są one jako lista
	private modelList:Model[];
	private defaultModel:Model;
	private moduleList:Module[];
	// private defaultModule : Module;
	private subscriberList:Event.BaseEvent[];
	constructor(name:string){
		this.actionList = [];
		// this.defaultActionList = [];
		this.moduleList = [];
		this.modelList = [];
		this.subscriberList = [];
		super(name);
	}

	public init(): Util.Promise<void> {
		return super.init()
		.then(() => {
			return this.initModules();
		})
		.then(() => {
			return this.initActions();
		})
		.then(() => {
			return this.initModels();
		});
	}
	public initModules(): Util.Promise<any> {
		return Util.Promise.map(this.moduleList, (childModule: Module) => {
			childModule.setViewClass(this.getViewClass());
			return childModule.init();
		});
	}
	public initModels(): Util.Promise<any> {
		return Util.Promise.map(this.modelList, (model: Model) => {
			return model.init();
		});
	}
	public initActions(): Util.Promise<any> {
		return Util.Promise.map(this.actionList, (action: Action.BaseAction) => {
			action.setViewClass(this.getViewClass());
			return action.init();
		});
	}
	protected addAction(action:Action.BaseAction){
		this.actionList.push(action);
		action.parent = this;
		// if(isDefault === true){
			// this.defaultActionList.push(action);
		// }
	}
	public getActionList():Action.BaseAction[]{
		return this.actionList;
	}
	public getAction(name:string):Action.BaseAction{
		for(var index in this.actionList){
			var action:Action.BaseAction = this.actionList[index];
			if(action.name === name){
				return action;
			}
		}
	}
	// public getDefaultActionList():Action.BaseAction[]{
		// return this.defaultActionList;
	// }
	protected addModule(module:Module){
		this.moduleList.push(module);
		module.parent = this;
		// if(isDefault === true){
			// this.defaultModule = module;
		// }
	}
	public getModuleList():Module[]{
		return this.moduleList;
	}
	public getModule(name:string):Module{
		for(var index in this.moduleList){
			var module:Module = this.moduleList[index];
			if(module.name === name){
				return module;
			}
		}
	}
	// public getDefaultModule():Module{
	// 	return this.defaultModule;
	// }
	protected addModel(model:Model,isDefault?:boolean){
		this.modelList.push(model);
		model.parent = this;
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
			if(model.name === name){
				return model;
			}
		}
	}
	public subscribe(subscriber:Event.BaseEvent){
		this.subscriberList.push(subscriber);
	}
	protected callSubscribers(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		Util.Promise.map(this.subscriberList, (subscriber: Event.BaseEvent) => {
			if(subscriber.isPublic() !== isPublic) {
				return;
			}
			if(subscriber.getType() !== type){
				return;
			}
			//subtype nie jest obowiązkowy, jeśli subscriber go nie zdefiniował to nie sprawdzamy jego zgodności
			if(subscriber.getSubtype() && subscriber.getSubtype() !== subtype){
				return;
			}
			//określenie patternu do ścieżki nie jest obowiązkowe więc dopasowanie będzie tylko jeśli jest on zdefiniowany
			if(subscriber.getEmiterRegExp() &&this.checkSubscriberEmiterPath(subscriber.getEmiterRegExp(), emiterPath) === false){
				return;
			}
			var callback = subscriber.getCallback();
			// var dataResponse:Event.BaseEvent.Data = new subscriber.dataObject(subscriber.getType());
			// dataResponse.setRawData(data);
			return new Util.Promise<void>((resolve:() => void) => {
				callback(request, response, resolve);
			});
		})
		.then(()=>{
				done();
		});
	}
	public broadcastPublisher(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string): Util.Promise<void> {
		return new Util.Promise<void>((resolve:() => void) => {
			this.callSubscribers(request, response, type, subtype, emiterPath, true, resolve);
		})
		.then(()=> {
			Util.Promise.map(this.moduleList, (module:Module)=> {
				return module.broadcastPublisher(request, response, type, subtype, emiterPath);
			})
		});
	}

	/**
	 * sprawdza czy dana ścieżka jest na nasłuchu
	 */
	private checkSubscriberEmiterPath(subscriberRegExp:RegExp, emiterPath:string):boolean{
		if(emiterPath.match(subscriberRegExp)){
			return true;
		}
		return false;
	}

}
export = Module;