import Action = require("./../../Action");
import Field = require("../Field");
import BaseValidator = require("./BaseValidator");
import ValidationResponse = require("./ValidationResponse");
import ValidatorResponse = require("./ValidatorResponse");
import FieldType = require("../FieldType");
import Util = require("../../../../../../util/Util");

/**
 * Odpowiada za przeprowadzenie procesu walidacji
 */
class Validation{
	private action: Action.BaseAction;
	private request: Action.Request;
	private data: Object;
	private validationResponse: ValidationResponse;
	constructor(action:Action.BaseAction, request:Action.Request){
		this.action = action;
		this.request = request;
		this.data = new Object();
		this.validationResponse = <ValidationResponse>{};
		this.validationResponse.valid = true;
		this.validationResponse.errorValidatorList = [];
	}
	private checkFields() {
		this.checkTypeFields(FieldType.PARAM_FIELD, this.request.getExpressRequest().params);
		this.checkTypeFields(FieldType.QUERY_FIELD, this.request.getExpressRequest().query);
		this.checkTypeFields(FieldType.BODY_FIELD, this.request.getExpressRequest().body);
		this.checkTypeFields(FieldType.HEADER_FIELD, this.request.getExpressRequest().headers);
		this.checkTypeFields(FieldType.APP_FIELD, null);
	}
	private checkTypeFields(type: string, expressFieldList: Object) {
		var fieldList: Field[] = this.action.getFieldListByType(type);
		var requestFieldList: Object = this.request.getFieldList(type);
		for (var indexField in fieldList) {
			var field: Field = fieldList[indexField];
			/**
			 * dany parametr może znajdować się już w requescie, dodany przez poprzednie akcje czy eventy. Używamy wtedy tego
			 */
			var value: any = requestFieldList[field.getFieldName()];
			if (value === undefined) {//znaczy że dany fieldetr nie był jeszcze dodany więc sprawdzamy czy jest w requestach expressa
				if (expressFieldList !== null) {
					value = expressFieldList[field.getFieldName()];
				}
			}
			if (value === undefined && field.optional === false) {// jeśłi fieldetr opcjonalny to ok, jeśli nie to rzucamy błąd
				value = null;
				this.validationResponse.valid = false;
				this.validationResponse.errorValidatorList.push({
					valid:false,
					validator:"NotEmptyValidator",
					value: value,
					field: field.getFieldName(),
					errorList: [{
						formatter: "Value is required and can't be empty"
					}]
				});
			} else {
				if (value === undefined) value = null;
			}
			if (!this.data[type]) this.data[type] = new Object();
			this.data[type][field.getFieldName()] = value;
		}
	}
	private validateValidators(): Util.Promise<any> {
		var fieldList: Field[] = this.action.getFieldList();
		return Util.Promise.map(fieldList, (field: Field) => {
			var value = this.data[field.getType()][field.getFieldName()];
			var validatorList: BaseValidator[] = field.getValidatorList();
			/**
			 * Jeśli wartość byłaby równa null to znaczy że albo już jest błąd walidatora NotEmpty
			 * albo fieldetr jest opcjonalny więc dla null nie sprawdzamy pozostałych walidatorów
			 */
			if (value !== null) {
				return Util.Promise.map(validatorList, (validator: BaseValidator) => {
					return new Util.Promise<ValidatorResponse>((resolve: (ValidatorResponse) => void) => {
						validator.validate(value, this.data, resolve);
					})
					.then((response:ValidatorResponse)=>{
						if (response.valid === false) {
							this.validationResponse.valid = false;
							this.validationResponse.errorValidatorList.push(response);
						}
					});
				});
			}
		});
	}
	private populateRequest(){
		var fieldList: Field[] = this.action.getFieldList();
		for (var i = 0; i < fieldList.length; i++) {
			var field: Field = fieldList[i];
			var value = this.data[field.getType()][field.getFieldName()];
			this.request.addField(field.getType(), field.getFieldName(), value);
		}
	}
	public validate(): Util.Promise<ValidationResponse> {
		return new Util.Promise<ValidationResponse>((resolve: (ValidationResponse) => void) => {
			this.checkFields();
			this.validateValidators()
			.then(()=>{
				if (this.validationResponse.valid === true) {
					this.populateRequest();
				}
				resolve(this.validationResponse);
			});
		});
	}
}
export = Validation;