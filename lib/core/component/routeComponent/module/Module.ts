import Core = require("../../../../index");
import RouteComponent = require("../RouteComponent");
import ComponentManager = require("../../ComponentManager");
import Component = require("../../Component");
import Action = require("./action/Action");
import Model = require("./model/Model");
import Util = require("../../../util/Util");
class Module extends RouteComponent{
	private _actionList:Action.BaseAction[];
	private _modelList:Model[];
	private _moduleList:Module[];
	private _eventListenerList: Core.EventListener.BaseEventListener[];
	constructor(parent: Module | ComponentManager, name: string) {
		this._actionList = [];
		this._moduleList = [];
		this._modelList = [];
		this._eventListenerList = [];
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
		} else if (child instanceof Core.EventListener.BaseEventListener) {
			this._eventListenerList.push(<Core.EventListener.BaseEventListener>child);
		}
	}
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
	public getModelList():Model[]{
		return this._modelList;
	}
	public getModel(name:string):Model{
		for(var index in this._modelList){
			var model:Model = this._modelList[index];
			if(model.name === name){
				return model;
			}
		}
	}
	protected callEventListeners(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		Util.Promise.map(this._eventListenerList, (eventListener: Core.EventListener.BaseEventListener) => {
			if(eventListener.isPublic() !== isPublic) {
				return;
			}
			if(eventListener.getType() !== type){
				return;
			}
			//subtype nie jest obowiązkowy, jeśli eventListener go nie zdefiniował to nie sprawdzamy jego zgodności
			if(eventListener.getSubtype() && eventListener.getSubtype() !== subtype){
				return;
			}
			//określenie patternu do ścieżki nie jest obowiązkowe więc dopasowanie będzie tylko jeśli jest on zdefiniowany
			if(eventListener.getEmiterRegExp() &&this.checkSubscriberEmiterPath(eventListener.getEmiterRegExp(), emiterPath) === false){
				return;
			}
			var eventHandler = eventListener.getHandler();
			return new Util.Promise<void>((resolve:() => void) => {
				eventHandler(request, response, resolve);
			});
		})
		.then(()=>{
				done();
		});
	}
	public broadcastPublisher(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string): Util.Promise<void> {
		return new Util.Promise<void>((resolve:() => void) => {
			this.callEventListeners(request, response, type, subtype, emiterPath, true, resolve);
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