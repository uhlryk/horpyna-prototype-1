import RouteComponent = require("../../RouteComponent");
import Component = require("../../../Component");
import Event = require("../../../event/Event");
import Field = require("./field/Field");
import Util = require("./../../../../util/Util");
import Response = require("./Response");
import Request = require("./Request");
import Validation = require("./Validation");
import UploadValidation = require("./UploadValidation");
import ValidationResponse = require("./ValidationResponse");
import FieldType = require("./field/FieldType");
import BaseValidator = require("./field/BaseValidator");
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
		this.initDebug("action:" + this.name);
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
		this.componentManager.dispatcher.addRoute(this.method, this.getRoutePath(true), this.getFileHandler(), this.getRequestHandler());
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
		var uploadValidationResponse: ValidationResponse = request.getValue("validationError");
		request.removeValue("validationError");
		var requestPromise = Util.Promise.resolve()
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
			if ((uploadValidationResponse && uploadValidationResponse.valid === false) || validationResponse.valid === false) {
				if (uploadValidationResponse){
					validationResponse.responseValidatorList.concat(uploadValidationResponse.responseValidatorList);
				}
				validationResponse.valid = false;
				response.addValue("validationError",validationResponse);
				response.setStatus(422);
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
			this.debug("action: check actionHandler if exist");
			if (this.actionHandler) {
				this.debug("action: actionHandler exist");
				return this.actionHandler(request, response);
			} else {
				this.debug("action: actionHandler not exist");
			}
		})
		.then(() => {
			if (response.allow === false) return;
			this.debug("action:publish():OnFinish");
			return this.publish(request, response, Event.Action.OnFinish.EVENT_NAME);
		})
		.then(() => {
			this.debug("action:finish");
			doneAction();
		});
		this.componentManager.actionCatchPromiseManager.catchToPromise(requestPromise, {
			request:request,
			response:response,
			done: doneAction
		});
	}
	public getRequestHandler(){
		this.debug("action:getRequestHandler()");
		return (request:Request, response:Response, next)=>{
			this.debug(request.getExpressRequest['body']);
			this.requestHandler(request, response, next);
		}
	}
	/**
	 * Uchwyt na obsługę walidacji plików. Jeśli walidacja poprawna to done(), gdy negatywna done(false)
	 * UWAGA!!!
	 * Walidatory na tym poziomie nie mogą być asynchroniczne
	 * W przeciwnym razie moduł uploadu pliku nie powiąże się z błędem przekroczenia rozmiaru i innymi limitami
	 * -PROBLEM ZEWNĘTRZNEGO MODUŁU - MULTER
	 */
	protected fileFilterHandler(request:Request, file, done){
		// var requestPromise = Util.Promise.resolve()
		// .then(() => {
			this.debug("action:validate UploadFile " + file['fieldname']);
			var validation = new UploadValidation(this, request, file['fieldname']);
			var validationResponse: ValidationResponse = validation.validate();
		// })
		// .then((validationResponse:ValidationResponse)=>{
			if (validationResponse.valid === false){
				request.addValue("validationError", validationResponse);
				console.log("B1");
				done(false);
			}
			console.log("B2");
			done(true);
		// })
	}
	/**
	 * Zwraca middleware do obsługi plików (multer)
	 */
	public getFileHandler(){
		this.debug("action:getFileHandler()");
		var fileUpload: Util.FileUpload = new Util.FileUpload();
		fileUpload.directory = this.getData("uploadDirectory");
		var fileFields: Object[] = this.populateFileFields();
		fileUpload.fileFilterHandler = (request: Request, file, done) => {
			this.fileFilterHandler(request, file, done);
		};
		return (req, res, next) => {
			var response: Response = Response.ExpressToResponse(res);
			if (fileFields.length > 0 && response.allow === true) {
				fileUpload.create(fileFields)(req, res, function(err){
					console.log("A");
					if (err) {
						var request: Request = Request.ExpressToRequest(req);
						var validationResponse: ValidationResponse = request.getValue("validationError");
						if(!validationResponse){
							validationResponse = <ValidationResponse>{};
							validationResponse.valid = false;
							validationResponse.responseValidatorList = [];
							request.addValue("validationError", validationResponse);
						}
						validationResponse.responseValidatorList.push({
							valid:false,
							validator:"FileSizeValidator",
							value: null,
							field: err.field,
							errorList: [err.code]
						});
						console.log(err);
					}
					next();
				});
			} else {
				this.debug("getFileHandler no file callback");
				next();
			}
		}
	}
	/**
	 * Na potrzeby FileUpload tworzy listę pól które ma akcje i które są polami plików
	 * @return {[name, count]} [description]
	 */
	protected populateFileFields():Object[]{
		var fileFields: Object[] = [];
		var fieldList: Field[] = this.getFieldList();
		for (var index in this.fieldList) {
			var field: Field = this.fieldList[index];
			if (field.getType() === FieldType.FILE_FIELD) {
				fileFields.push({
					name: field.getFieldName(),
					count: field.options['maxCount'] || 1,
				});
			}
		}
		return fileFields;
	}
}
export  = BaseAction;