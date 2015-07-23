import ValidatorResponse = require("./ValidatorResponse");
import BaseValidator = require("./BaseValidator");
import Util = require("../../../../../../util/Util");
/**
 * sprawdza czy parametr który jest stringiem ma dany fragment
 */
class IsFloatValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsFloatValidator";
	private min: number;
	private max: number;
	public message = "The input must be float";
	constructor(name:string){
		super(name);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isFloat(value)) {
			return true;
		}
		response.errorList = [{
			formatter: this.getErrorMessage(),
		}];
		return false;
	}
}
export = IsFloatValidator;
