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
	private valueByTypeList: Object;
	private validationResponse: ValidationResponse;
	protected debugger: Util.Debugger;
	constructor(action:Action.BaseAction, request:Action.Request){
		this.action = action;
		this.request = request;
		this.valueByTypeList = new Object();
		this.validationResponse = <ValidationResponse>{};
		this.validationResponse.valid = true;
		this.validationResponse.responseValidatorList = [];
		this.debugger = new Util.Debugger("validation");
	}
	public debug(...args: any[]){
		this.debugger.debug(args);
	}
	private checkFields() {
		this.checkTypeFields(FieldType.PARAM_FIELD, this.request.getExpressRequest().params);
		this.checkTypeFields(FieldType.QUERY_FIELD, this.request.getExpressRequest().query);
		this.checkTypeFields(FieldType.BODY_FIELD, this.request.getExpressRequest().body);
		this.checkTypeFields(FieldType.HEADER_FIELD, this.request.getExpressRequest().headers);
		this.checkTypeFields(FieldType.APP_FIELD, null);
	}
	private checkTypeFields(type: string, expressFieldList: Object) {
		this.debug('checkTypeFields type: %s', type);
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
			this.debug("field name: %s, value: %s",field.name, value);
			if (value === undefined && field.optional === false) {// jeśłi fieldetr opcjonalny to ok, jeśli nie to rzucamy błąd
				value = null;
				this.validationResponse.valid = false;
				this.validationResponse.responseValidatorList.push({
					valid:false,
					validator:"NotEmptyValidator",
					value: value,
					field: field.getFieldName(),
					errorList: ["Value is required and can't be empty"]
				});
			} else {
				if (value === undefined) value = null;
			}
			if (!this.valueByTypeList[type]) this.valueByTypeList[type] = new Object();
			this.valueByTypeList[type][field.getFieldName()] = value;
		}
		this.debug(this.validationResponse);
	}
	private validateValidators(): Util.Promise<any> {
		this.debug('validateValidators');
		var fieldList: Field[] = this.action.getFieldList();
		return Util.Promise.map(fieldList, (field: Field) => {
			//na liście wartości może nie być określonego typu - np FILE_FIELD
			var valueList = this.valueByTypeList[field.getType()];
			if (!valueList){
				return;
			}
			var value = valueList[field.getFieldName()];
			var validatorList: BaseValidator[] = field.getValidatorList();
			this.debug("field name: %s, value: %s", field.name, value);
			/**
			 * Jeśli wartość byłaby równa null to znaczy że albo już jest błąd walidatora NotEmpty
			 * albo fieldetr jest opcjonalny więc dla null nie sprawdzamy pozostałych walidatorów
			 */
			if (value !== null) {
				return Util.Promise.map(validatorList, (validator: BaseValidator) => {
					return new Util.Promise<ValidatorResponse>((resolve: (ValidatorResponse) => void) => {
						validator.validate(value, this.valueByTypeList, resolve);
					})
					.then((response:ValidatorResponse)=>{
						this.debug("validator name: %s", validator.name);
						if (response.valid === false) {
							this.debug(response.valid);
							this.validationResponse.valid = false;
						}
						//nawet jeśli nie ma błędów co było walidowane i przez jaki walidator <- przy wyświetlaniu formularza będzie potrzebne
						this.validationResponse.responseValidatorList.push(response);
					});
				});
			}
		});
	}
	private populateRequest(){
		this.debug('populateRequest');
		var fieldList: Field[] = this.action.getFieldList();
		for (var i = 0; i < fieldList.length; i++) {
			var field: Field = fieldList[i];
			var valueList = this.valueByTypeList[field.getType()];
			if (!valueList){
				return;
			}
			var value = valueList[field.getFieldName()];
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