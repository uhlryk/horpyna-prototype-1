import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./ValidatorResponse");
import BaseValidator = require("./BaseValidator");
/**
 * sprawdza czy parametr string jest równy innej wartości (jeśli nie jest stringiem to zostanie zamieniona)
 */
class IsAlnumValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsAlnumValidator";
	public message = "The input may contain only a-zA-Z0-9";
	constructor(name:string){
		super(name);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isAlphanumeric(value)){
			return true;
		}
		response.errorList = [{
			formatter: this.getErrorMessage(),
		}];
		return false;
	}
}
export = IsAlnumValidator;
