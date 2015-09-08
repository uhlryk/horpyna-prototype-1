import Action = require("./Action");
import Field = require("./field/Field");
import BaseValidator = require("./field/BaseValidator");
import ValidationResponse = require("./ValidationResponse");
import ValidatorResponse = require("./field/ValidatorResponse");
import FieldType = require("./field/FieldType");
import Util = require("./../../../../util/Util");
import Element = require("./../../../../Element");
/**
 * Odpowiada za przeprowadzenie procesu walidacji
 */
class Validation extends Element {
	private action: Action.BaseAction;
	private request: Action.Request;
	private valueByTypeList: Object;
	private validationResponse: ValidationResponse;
	constructor(action:Action.BaseAction, request:Action.Request){
		super();
		this.action = action;
		this.request = request;
		this.valueByTypeList = new Object();
		this.validationResponse = <ValidationResponse>{};
		this.validationResponse.valid = true;
		this.validationResponse.responseValidatorList = [];
		this.initDebug("validation");
	}
	private checkFields() {
		this.checkTypeFields(FieldType.PARAM_FIELD, this.request.getExpressRequest().params);
		this.checkTypeFields(FieldType.QUERY_FIELD, this.request.getExpressRequest().query);
		this.checkTypeFields(FieldType.BODY_FIELD, this.request.getExpressRequest().body);
		this.checkTypeFields(FieldType.HEADER_FIELD, this.request.getExpressRequest().headers);
		this.checkTypeFields(FieldType.FILE_FIELD, this.request.getExpressRequest().files);
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
				if (expressFieldList) {
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
				if (validatorList.length) {
					return Util.Promise.map(validatorList, (validator: BaseValidator) => {
						if (validator.validationPhase !== BaseValidator.POSTUPLOAD_PHASE) {
							return;
						}
						return new Util.Promise<ValidatorResponse>((resolve: (ValidatorResponse) => void) => {
							validator.validate(value, this.valueByTypeList, resolve);
						})
							.then((response: ValidatorResponse) => {
								this.debug("validator name: %s", validator.name);
								if (response.valid === false) {
									this.debug(response.valid);
									this.validationResponse.valid = false;
								}
								/**
								 * nawet jeśli nie ma błędów przy danej walidacji, to mogą być przy innych, a wtedy informacja
								 * co zwalidowane dla jakich pól będzie ważna, dlatego nawet poprawne walidacje zapisuję
								 */
								this.validationResponse.responseValidatorList.push(response);
							});
					});
				} else {//znaczy że pole nie ma walidatora ale chcemy mieć jego dane w odpowiedzi walidacji
					this.validationResponse.responseValidatorList.push({
						valid:true,
						validator:"Null",
						value: value,
						field: field.getFieldName()
					});
				}
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