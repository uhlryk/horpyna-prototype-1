import BaseAction = require("./BaseAction");
import Request = require("./Request");
import RouteComponent = require("../../RouteComponent");
import Field = require("./field/Field");
import FieldType = require("./field/FieldType");
import FormInputType = require("./field/FormInputType");
import IInputForm = require("./IInputForm");
import IForm = require("./IForm");
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
	public createForm(request: Request): IForm {
		var paramAppList = request.getParamAppFieldList();
		var form: IForm = <IForm>{};
		form.method = this.targetAction.getMethod();
		form.errorList = [];
		form.valid = true;
		var fieldList: Field[] = this.targetAction.getFieldList();
		form.fields = [];
		form.isMultipart = false;
		var tempNameField = [];
		for (var i = 0; i < fieldList.length; i++) {
			var field: Field = fieldList[i];
			if (field.getType() === FieldType.BODY_FIELD || field.getType() === FieldType.FILE_FIELD) {
				if (field.getType() === FieldType.FILE_FIELD){
					form.isMultipart = true;
				}
				tempNameField.push(field.getFieldName());
				var inputField: IInputForm = this.createInputField(true, field.getFieldName(), field.formInputType, field.labelForm);
				form.fields.push(inputField);
			}
		}
		fieldList = this.getFieldList();
		for (var i = 0; i < fieldList.length; i++) {
			var field: Field = fieldList[i];
			if (field.getType() === FieldType.BODY_FIELD || field.getType() === FieldType.FILE_FIELD) {
				if (field.getType() === FieldType.FILE_FIELD){
					form.isMultipart = true;
				}
				if (tempNameField.indexOf(field.getFieldName()) === -1) {
					var inputField: IInputForm = this.createInputField(true, field.getFieldName(), field.formInputType, field.labelForm);
					form.fields.push(inputField);
				}
			}
		}

		var inputField: IInputForm = this.createInputField(false, "_source", FormInputType.HIDDEN, "");
		inputField.value = this.populateRoutePath(paramAppList);
		form.fields.push(inputField);
		var inputField: IInputForm = this.createInputField(false, "_submit", FormInputType.SUBMIT, "");
		form.fields.push(inputField);
		var route = this.targetAction.populateRoutePath(paramAppList);
		form.action = route;
		return form;
	}
	/**
	 * Tworzy pojedyńcze pole dla formularza
	 * @param  {boolean}    isBody jeśli false to mamy do czynienia z specjalnym polem typu submit, jeśli true to generowanym z pól
	 * @param  {string}     name  odpowiada atrybutowi w input
	 * @param  {string}     type  odpowiada atrybutowi w input
	 * @param  {string}     label nazwa labela dla inputa
	 * @return {IInputForm}       zwraca pole dla formularza
	 */
	protected createInputField(isBody:boolean, name: string, type: string, label: string): IInputForm {
		var inputForm: IInputForm = <IInputForm>{};
		inputForm.isBody = isBody;
		inputForm.name = name;
		inputForm.type = type;
		inputForm.label = label;
		inputForm.value = "";
		inputForm.valid = true;
		inputForm.errorList = [];
		return inputForm;
	}
	/**
	 * Poniższa konstrukcja pozwoli dodać do responsa formularz, nie psując działania ActionHandlera
	 */
	public setActionHandler(actionHandler:IActionHandler){
		super.setActionHandler((request, response) => {
			var content = new Object();
			content['form'] = this.createForm(request)
			response.content = content;
			return actionHandler(request, response);
		});
	}
}
export  = FormAction;