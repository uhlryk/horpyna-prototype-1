import Action = require("./../../Action");
import Param = require("../Param");
import BaseValidator = require("./BaseValidator");
import ValidationResponse = require("./ValidationResponse");
import ValidatorResponse = require("./ValidatorResponse");
// import ParamList = require("./param/ParamList");
import ParamType = require("../ParamType");

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
	private checkParams() {
		this.checkTypeParams(ParamType.PARAM_URL, this.request.getExpressRequest().params);
		this.checkTypeParams(ParamType.PARAM_QUERY, this.request.getExpressRequest().query);
		this.checkTypeParams(ParamType.PARAM_BODY, this.request.getExpressRequest().body);
		this.checkTypeParams(ParamType.PARAM_APP, null);
	}
	private checkTypeParams(type: string, expressParamList: Object) {
		var paramList: Param[] = this.action.getParamListByType(type);
		var requestParamList: Object = this.request.getParamList(type);
		for (var indexParam in paramList) {
			var param: Param = paramList[indexParam];
			/**
			 * dany parametr może znajdować się już w requescie, dodany przez poprzednie akcje czy eventy. Używamy wtedy tego
			 */
			var value: any = requestParamList[param.getParam()];
			if (value === undefined) {//znaczy że dany parametr nie był jeszcze dodany więc sprawdzamy czy jest w requestach expressa
				if (expressParamList !== null) {
					value = expressParamList[param.getParam()];
				}
			}
			if (value === undefined && param.optional === false) {// jeśłi parametr opcjonalny to ok, jeśli nie to rzucamy błąd
				this.validationResponse.valid = false;
				this.validationResponse.errorValidatorList.push({
					valid:false,
					validator:"NotEmptyValidator",
					value : null,
					field: param.getParam(),
					errorList: [{
						formatter: "Value is required and can't be empty"
					}]
				});
			} else {
				if (value === undefined) value = null;
				if (!this.data[type]) this.data[type] = new Object();
				this.data[type][param.getParam()] = value;
			}
		}
	}
	private validateValidators(){
		var paramList: Param[] = this.action.getParamList();
		for (var i = 0; i < paramList.length; i++) {
			var param: Param = paramList[i];
			var value = this.data[param.getType()][param.getParam()];
			var validatorList: BaseValidator[] = param.getValidatorList();
			/**
			 * Jeśli wartość byłaby równa null to znaczy że albo już jest błąd walidatora NotEmpty
			 * albo parametr jest opcjonalny więc dla null nie sprawdzamy pozostałych walidatorów
			 */
			if (value !== null) {
				for (var j = 0; j < validatorList.length; j++) {
					var validator: BaseValidator = validatorList[j];
					var response = validator.validate(value, this.data);
					if (response.valid === false) {
						this.validationResponse.valid = false;
						this.validationResponse.errorValidatorList.push(response);
					}
				}
			}
		}
	}
	private populateRequest(){
		var paramList: Param[] = this.action.getParamList();
		for (var i = 0; i < paramList.length; i++) {
			var param: Param = paramList[i];
			var value = this.data[param.getType()][param.getParam()];
			this.request.addParam(param.getType(), param.getParam(), value);
		}
	}
	public validate(){
		this.checkParams();
		this.validateValidators();
		if (this.validationResponse.valid === true) {
			this.populateRequest();
		}
	}
}
export = Validation;