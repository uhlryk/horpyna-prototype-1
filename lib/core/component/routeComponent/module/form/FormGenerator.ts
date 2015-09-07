import IForm = require("./IForm");
import IInputForm = require("./IInputForm");
import Field = require("./../action/field/Field");
import FieldType = require("./../action/field/FieldType");
import ValidationResponse = require("./../action/ValidationResponse");
import ValidatorResponse = require("./../action/field/ValidatorResponse");
import FormInputType = require("./../action/field/FormInputType");
class FormGenerator{
	private _fieldList: Field[];
	constructor(){
		this._fieldList = [];
	}
	public addFieldList(fieldList:Field[]){
		if(this._fieldList.length === 0 ){
			this._fieldList = fieldList;
		} else {
			var newList = this._fieldList.slice();
			for (var j = 0; j < fieldList.length; j++){
				var checkField = fieldList[i];
				var index: number = -1;
				for (var i = 0; i < this._fieldList.length; i++){
					var oldField = this._fieldList[i];
					if (oldField === checkField) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					newList[index] = checkField;
				} else {
					newList.push(checkField);
				}
			}
			this._fieldList = newList;
		}
	}
	public populateValidation(form: IForm, validationResponse: ValidationResponse) {
		if (validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
			form.valid = false;
			var fieldList: IInputForm[] = form.fields;
			for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
				var validatorResponse: ValidatorResponse = validationResponse.responseValidatorList[i];
				for (var j = 0; j < fieldList.length; j++) {
					var field: IInputForm = fieldList[j];
					if (field.name === validatorResponse.field) {
						field.value = validatorResponse.value;
						field.valid = validatorResponse.valid;
						if (validatorResponse.valid === false) {
							field.errorList = field.errorList.concat(validatorResponse.errorList);
						}
					}
				}
			}
		}
	}
	public setTarget(form :IForm, url:string){
		form.action = url;
	}
	public setMethod(form: IForm, method: string) {
		form.method = method;
	}
	public setSourceHiddenField(form: IForm, url:string) {
		var inputField: IInputForm = this.createInputField(false, "_source", FormInputType.HIDDEN, "");
		inputField.value = url;
		form.fields.push(inputField);
	}
	public createForm() : IForm{
		var form: IForm = <IForm>{};
		form.errorList = [];
		form.valid = true;
		form.fields = [];
		form.isMultipart = false;
		for (var i = 0; i < this._fieldList.length; i++) {
			var field: Field = this._fieldList[i];
			if (field.getType() === FieldType.BODY_FIELD || field.getType() === FieldType.FILE_FIELD) {
				var inputField: IInputForm = this.createInputField(true, field.getFieldName(), field.formInputType, field.labelForm);
				form.fields.push(inputField);
				if (field.getType() === FieldType.FILE_FIELD){
					form.isMultipart = true;
				}
			}
		}
		var inputField: IInputForm = this.createInputField(false, "_submit", FormInputType.SUBMIT, "");
		form.fields.push(inputField);
		return form;
	}
	public createInputField(isBody:boolean, name: string, type: string, label: string): IInputForm {
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
}
export = FormGenerator;