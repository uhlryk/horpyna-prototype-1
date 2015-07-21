import Action = require("./Action");
import Param = require("./param/Param");
import Validator = require("./param/validator/Validator");
// import ParamList = require("./param/ParamList");
import ParamType = require("./param/ParamType");
/**
 * Odpowiada za przeprowadzenie procesu walidacji
 */
class Validation{
	private action: Action.BaseAction;
	private request: Action.Request;
	private data: Object;
	private validationResponse: Object;
	private validatorList: Object;
	constructor(action:Action.BaseAction, request:Action.Request){
		this.action = action;
		this.request = request;
		this.data = new Object();
		this.validationResponse = new Object();
		this.validatorList = new  Object();
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
				//tu odpowiedź negatywna
			} else {
				if (!this.data[type]) this.data[type] = new Object();
				this.data[type][param.getParam()] = value;
				var paramValidatorList: Validator[] = param.getValidatorList();
				this.validatorList[param.getParam()] = new Object();
				this.validatorList[param.getParam()]['value'] = value;
				this.validatorList[param.getParam()]['type'] = type;
				this.validatorList[param.getParam()]['validator'] = [];

				for (var indexValidator in paramValidatorList) {
					var validator: Validator = paramValidatorList[indexValidator];

					this.validatorList[param.getParam()]['validator'].push(validator);
				}
			}
		}
	}
	private validateValidators(){
		for (var paramName in this.validatorList) {
			var paramObject:Object[] = this.validatorList[paramName];
			var value = paramObject['value'];
			var type = paramObject['type'];
			for (var indexValidator in paramObject['validator']) {
				var validator = paramObject['validator'][indexValidator];
				var validatorResponse = validator.validate(value, this.data);
			}
			this.request.addParam(type, paramName, value);
		}
	}
	public validate(){
		this.checkParams();
		this.validateValidators();
	}
}
export = Validation;