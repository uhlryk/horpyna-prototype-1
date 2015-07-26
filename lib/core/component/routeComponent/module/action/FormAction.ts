import BaseAction = require("./BaseAction");
import Request = require("./Request");
import RouteComponent = require("../../RouteComponent");
import Field = require("./field/Field");
import FieldType = require("./field/FieldType");
import IActionHandler = require("./IActionHandler");

/**
 * Akcja dziedziczy po BaseAction. Jest powiązana z inną akcją.
 * Celem jest zrobienie i wyświetlenie informacji o polach (JadeResourceModule z tego renderuje formularz)
 */

class FormAction extends BaseAction {
	private targetAction: BaseAction;
	constructor(targetAction:BaseAction, name?:string){
		super(BaseAction.GET, name || FormAction.formActionName(targetAction.name));
		this.targetAction = targetAction;
		var paramFields: Field[] = this.targetAction.getFieldListByType(FieldType.PARAM_FIELD);
		for (var i = 0; i < paramFields.length; i++) {
			var field: Field = paramFields[i];
			this.addField(new Field(field.name, field.getType(), field.getFieldName()));
		}
	}
	/**
	 * Na podstawie nazwy akcji docelowej zwróci nazwę akcji wygenerowanej zawierającej formularz
	 */
	public static formActionName(targetActionName:string):string {
		return "form" + targetActionName;
	}
	/**
	 * na podstawie targetAction BODY_FIELD buduje formularz który ma służyć do dodawania wartości dla
	 * targetAction
	 */
	public build(request: Request) {
		var formContent = new Object();
		formContent['fields'] = [];
		formContent['form'] = new Object();
		formContent['form']['method'] = this.targetAction.getMethod();
		formContent['form']['buttonName'] = "send";
		var bodyFields: Field[] = this.targetAction.getFieldListByType(FieldType.BODY_FIELD);
		for (var i = 0; i < bodyFields.length; i++) {
			var field: Field = bodyFields[i];
			var fieldForm: Object = new Object();
			fieldForm["fieldName"] = field.getFieldName();
			fieldForm["name"] = field.name;
			fieldForm["fieldForm"] = field.fieldForm;
			fieldForm["labelForm"] = field.labelForm;
			fieldForm["value"] = "";
			formContent['fields'].push(fieldForm);
		}
		var paramList = request.getFieldList(FieldType.PARAM_FIELD);
		// var paramFields: Field[] = this.targetAction.getFieldListByType(FieldType.PARAM_FIELD);
		var route = this.targetAction.fullRoute;
		for (var paramName in paramList) {
			var val = paramList[paramName];
			route = RouteComponent.buildRoute(route, val);
		}
		formContent['form']['action'] = route;
		return formContent;
	}
	/**
	 * Poniższa konstrukcja pozwoli dodać do responsa formularz, nie psując działania ActionHandlera
	 */
	public setActionHandler(actionHandler:IActionHandler){
		super.setActionHandler((request, response, done) => {
			response.setContent(this.build(request));
			// var content = response.getData("content");
			actionHandler(request, response, done);
		});
	}
}
export  = FormAction;