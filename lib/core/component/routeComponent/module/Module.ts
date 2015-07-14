import RouteComponent = require("../RouteComponent");
import Event = require("../../event/Event");
import Action = require("./action/Action");
import Model = require("./model/Model");
import Util = require("../../../util/Util");
class Module extends RouteComponent{
	private actionList:Action[];
	private defaultActionList:Action[];//może być więcej niż jedna akcja domyślna więc są one jako lista
	private modelList:Model[];
	private defaultModel:Model;
	private moduleList:Module[];
	private defaultModule : Module;
	private subscriberList:Event.BaseEvent.Subscriber[];
	constructor(name:string){
		this.actionList = [];
		this.defaultActionList = [];
		this.moduleList = [];
		this.modelList = [];
		this.subscriberList = [];
		super(name);
		this.onConstructor();
	}
	public onConstructor(){

	}
	protected onInit():void{
		super.onInit();
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
	protected callSubscribers(type:string, subtype:string, emiterPath:string, isPublic:boolean, data:Object, done):void{
		Util.Promise.map(this.subscriberList, (subscriber:Event.BaseEvent.Subscriber)=> {
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
			var dataResponse:Event.BaseEvent.Data = new subscriber.dataObject(subscriber.getType());
			dataResponse.setRawData(data);
			return new Util.Promise<void>((resolve:() => void) => {
				callback(dataResponse, resolve);
			});
		})
		.then(()=>{
				done();
		});
	}
	public broadcastPublisher(type:string, subtype:string, emiterPath:string, data:Object):Util.Promise<void>{
		return new Util.Promise<void>((resolve:() => void) => {
			this.callSubscribers(type, subtype, emiterPath, true, data, resolve);
		})
		.then(()=> {
			Util.Promise.map(this.moduleList, (module:Module)=> {
				return module.broadcastPublisher(type, subtype, emiterPath, data);
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