import RouteComponent = require("../RouteComponent");
import ComponentManager = require("../../ComponentManager");
import Component = require("../../Component");
import Event = require("../../event/Event");
import Action = require("./action/Action");
import Model = require("./model/Model");
import Util = require("../../../util/Util");
class Module extends RouteComponent{
	private _actionList:Action.BaseAction[];
	// private _defaultAction:Action.BaseAction;
	private _modelList:Model[];
	// private _defaultModel:Model;
	private _moduleList:Module[];
	// private defaultModule : Module;
	private _subscriberList:Event.BaseEvent[];
	constructor(parent: Module | ComponentManager, name: string) {
		this._actionList = [];
		// this.defaultActionList = [];
		this._moduleList = [];
		this._modelList = [];
		this._subscriberList = [];
		super(<Component>parent, name);
	}

	public addChild(child: Component) {
		super.addChild(child);
		if (child instanceof Module) {
			this._moduleList.push(<Module>child);
		} else if (child instanceof Action.BaseAction) {
			this._actionList.push(<Action.BaseAction>child);
		} else if (child instanceof Model) {
			this._modelList.push(<Model>child);
		}
	}
	// public initModules(): Util.Promise<any> {
	// 	return Util.Promise.map(this._moduleList, (childModule: Module) => {
	// 		return childModule.init();
	// 	});
	// }
	// public initModels(): Util.Promise<any> {
	// 	return Util.Promise.map(this._modelList, (model: Model) => {
	// 		return model.init();
	// 	});
	// }
	// public initActions(): Util.Promise<any> {
	// 	return Util.Promise.map(this._actionList, (action: Action.BaseAction) => {
	// 		return action.init();
	// 	});
	// }
	// protected addAction(action: Action.BaseAction, isDefault?:boolean): Util.Promise<void> {
	// 	this._actionList.push(action);
	// 	return action.prepare(this);
	// 	if(isDefault === true){
	// 		this._defaultAction = action;
	// 	}
	// }
	public getActionList():Action.BaseAction[]{
		return this._actionList;
	}
	public getAction(name:string):Action.BaseAction{
		for(var index in this._actionList){
			var action:Action.BaseAction = this._actionList[index];
			if(action.name === name){
				return action;
			}
		}
	}
	// public get defaultAction():Action.BaseAction{
	// 	return this._defaultAction;
	// }
	// protected addModule(module: Module): Util.Promise<void> {
	// 	this._moduleList.push(module);
	// 	return module.prepare(this);
	// }
	public getModuleList():Module[]{
		return this._moduleList;
	}
	public getModule(name:string):Module{
		for(var index in this._moduleList){
			var module:Module = this._moduleList[index];
			if(module.name === name){
				return module;
			}
		}
	}
	// public getDefaultModule():Module{
	// 	return this.defaultModule;
	// }
	// protected addModel(model: Model, isDefault?: boolean): Util.Promise<void> {
	// 	this._modelList.push(model);
	// 	if(isDefault === true){
	// 		this._defaultModel = model;
	// 	}
	// 	return model.prepare(this);
	// }
	public getModelList():Model[]{
		return this._modelList;
	}
	// public getDefaultModel():Model{
	// 	return this._defaultModel;
	// }
	public getModel(name:string):Model{
		for(var index in this._modelList){
			var model:Model = this._modelList[index];
			if(model.name === name){
				return model;
			}
		}
	}
	public subscribe(subscriber:Event.BaseEvent){
		this._subscriberList.push(subscriber);
	}
	protected callSubscribers(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		Util.Promise.map(this._subscriberList, (subscriber: Event.BaseEvent) => {
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
			Util.Promise.map(this._moduleList, (module:Module)=> {
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