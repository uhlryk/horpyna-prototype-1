import BaseAction = require("./BaseAction");
import Request = require("./Request");
import RouteComponent = require("../../RouteComponent");
import Field = require("./field/Field");
import FieldType = require("./field/FieldType");
import IActionHandler = require("./IActionHandler");
import Util = require("./../../../../util/Util");

/**
 * Akcja dziedziczy po BaseAction. Jest powiązana z inną akcją.
 * Celem jest zrobienie i wyświetlenie informacji o polach (JadeResourceModule z tego renderuje formularz)
 */

class FormAction extends BaseAction {
	private targetAction: BaseAction;
	constructor(targetAction:BaseAction, name:string){
		super(BaseAction.GET, name);
		this.targetAction = targetAction;
	}
	public init(): Util.Promise<void> {
		this.copyTargetParams();
		return super.init();
	}
	/**
	 * Kopiuje PARAM_FIELD z target action
	 */
	protected copyTargetParams(){
		var paramFields: Field[] = this.targetAction.getFieldListByType(FieldType.PARAM_FIELD);
		for (var i = 0; i < paramFields.length; i++) {
			var field: Field = paramFields[i];
			this.addField(new Field(field.name, field.getType(), field.getFieldName()));
		}
	}
	/**
	 * na podstawie targetAction BODY_FIELD buduje formularz który ma służyć do dodawania wartości dla
	 * targetAction
	 */
	public buildForm(request: Request) {
		var formContent = new Object();
		formContent['fields'] = [];
		formContent['form'] = new Object();
		formContent['form']['method'] = this.targetAction.getMethod();
		formContent['form']['buttonName'] = "send";
		formContent['form']["error-message"] = [];
		var bodyFields: Field[] = this.targetAction.getFieldListByType(FieldType.BODY_FIELD);
		var ownBodyFields: Field[] = this.getFieldListByType(FieldType.BODY_FIELD);
		bodyFields.push.apply(bodyFields, ownBodyFields);
		for (var i = 0; i < bodyFields.length; i++) {
			var field: Field = bodyFields[i];
			var inputForm: Object = new Object();
			inputForm["fieldName"] = field.getFieldName();
			inputForm["name"] = field.name;
			inputForm["formType"] = field.formType;
			inputForm["labelForm"] = field.labelForm;
			inputForm["value"] = "";
			inputForm["error-message"] = null;
			formContent['fields'].push(inputForm);
		}
		var paramAppList = request.getParamAppFieldList();
		var route = this.targetAction.populateRoutePath(paramAppList);
		formContent['form']['action'] = route;
		return formContent;
	}
	/**
	 * Poniższa konstrukcja pozwoli dodać do responsa formularz, nie psując działania ActionHandlera
	 */
	public setActionHandler(actionHandler:IActionHandler){
		super.setActionHandler((request, response, done) => {
			response.setContent(this.buildForm(request));
			actionHandler(request, response, done);
		});
	}
}
export  = FormAction;