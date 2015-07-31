import RouteComponent = require("../../RouteComponent");
import Component = require("../../../Component");
import Event = require("../../../event/Event");
import Field = require("./field/Field");
import Util = require("./../../../../util/Util");
import Response = require("./Response");
import Request = require("./Request");
import Validation = require("./field/validator/Validation");
import ValidationResponse = require("./field/validator/ValidationResponse");
import FieldType = require("./field/FieldType");
import IActionHandler = require("./IActionHandler");

class BaseAction extends RouteComponent {
	private actionHandler:IActionHandler;
	private fieldList:Field[];
	private method:string;
	public static ALL:string = "all";
	public static POST:string = "post";
	public static GET:string = "get";
	public static PUT:string = "put";
	public static DELETE:string = "delete";

	constructor(method:string, name:string){
		super(name);
		this.debugger = new Util.Debugger("action:" + this.name);
		this.method = method;
		this.fieldList = [];
	}
	public init(): Util.Promise<void> {
		return super.init()
		.then(()=>{
			this.addRoute();
			return this.initFields();
		});
	}
	/**
	 * Buduje route
	 */
	protected addRoute(){
		this.componentManager.dispatcher.addRoute(this.method, this.getRoutePath(true), this.getRequestHandler());
	}
	public initFields(): Util.Promise<any> {
		return Util.Promise.map(this.fieldList, (field: Field) => {
			// field.logger = this.logger;
			return field.init();
		});
	}
	public addField(field: Field): Util.Promise<void> {
		this.fieldList.push(field);
		if (this.isInit === true) {
			throw SyntaxError(Component.ADD_INIT_CANT);
		}
		return field.prepare(this);
	}
	public getFieldList(): Field[] {
		return this.fieldList;
	}
	public getFieldListByType(type:string): Field[] {
		var typeFieldList = [];
		for (var index in this.fieldList) {
			var field: Field = this.fieldList[index];
			if(field.getType() === type){
				typeFieldList.push(field);
			}
		};
		return typeFieldList;
	}
	public getField(type: string, name: string): Field {
		for (var index in this.fieldList) {
			var field: Field = this.fieldList[index];
			if (field.name === name && field.getType() === type) {
				return field;
			}
		}
		return null;
	}
	/**
	 * Nadpisuje RouteComponent.getRoutePath tak by uwzględniał parametry jeśli paramInPath = true(biorą one udział w określaniu route w routerze)
	 *
	 * @return {string} zwraca ścieżkę np grandparentcomponent/parentcomponent/thiscomponent/:par1/:par2/:par3
	 */
	public getRoutePath(paramInPath?:boolean): string {
		var routePath = super.getRoutePath();
		if (paramInPath === true) {
			for (var index in this.fieldList) {
				var field: Field = this.fieldList[index];
				if (field.getType() === FieldType.PARAM_FIELD) {
					routePath = routePath + "/:" + field.getFieldName();
				}
			};
		}
		return routePath;
	}
	/**
	 * Wraca routePath ale z parametrami które są zastąpione wartościami znajdującymi się w obiekcie 'data'
	 * @param  {Object} data obiekt zawierający pary paramname:paramvalue
	 * @return {string}      grandparentcomponent/parentcomponent/thiscomponent/val1/val2/val3
	 */
	public populateRoutePath(data:Object):string{
		var routePath = this.getRoutePath();
		for (var index in this.fieldList) {
			var field: Field = this.fieldList[index];
			if (field.getType() === FieldType.PARAM_FIELD) {
				var value = data[field.getFieldName()];
				if(value === undefined){
					value = "0";
				}
				routePath = routePath + "/" + value;
			}
		};
		return routePath;
	}
	public getMethod():string {
		return this.method;
	}
	public setActionHandler(actionHandler:IActionHandler){
		this.actionHandler = actionHandler;
	}
	public requestHandler(request: Request, response: Response, doneAction) {
		this.debug("action:requestHandler:");
		this.debug("action:publish():OnBegin");
		Util.Promise.resolve()
		.then(() => {
			if (response.allow === false) return;
			return this.publish(request, response, Event.Action.OnBegin.EVENT_NAME)
		})
		.then(() => {
			if (response.allow === false) return;
			this.debug("action:validateRequest");
			var validation = new Validation(this, request);
			return validation.validate();
		})
		.then((validationResponse:ValidationResponse)=>{
			if (response.allow === false) return;
			if (validationResponse.valid === false){
				response.addValue("validationError",validationResponse);
				response.setStatus(422);
				//tu powinniśmy chyba zrobić przekierowanie do miejsca które wywołało formularz
				response.allow = false;
				response.valid = false;
			}
		})
		.then(() => {
			if (response.allow === false) return;
			this.debug("action:publish():OnReady");
			return this.publish(request, response, Event.Action.OnReady.EVENT_NAME);
		})
		.then(() => {
			if (response.allow === false) return;
			return new Util.Promise<void>((resolve:()=>void)=> {
				this.debug("action: check actionHandler if exist");
				if (this.actionHandler) {
					this.debug("action: actionHandler exist");
					this.actionHandler(request, response, resolve);
				} else {
					this.debug("action: actionHandler not exist");
					resolve();
				}
			})
		})
		.then(() => {
			if (response.allow === false) return;
			this.debug("action:publish():OnFinish");
			return this.publish(request, response, Event.Action.OnFinish.EVENT_NAME);
		})
		.then(() => {
			this.debug("action:finish");
			doneAction();
		})
		.catch((err)=>{
			console.log("AA");
			this.logger.error(err);
			this.debug("error");
			response.setStatus(500);
			doneAction();
		});
	}
	public getRequestHandler(){
		this.debug("action:getRequestHandler()");
		return (request:Request, response:Response, next)=>{
			this.requestHandler(request, response, next);
		}
	}
}
export  = BaseAction;