import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./ValidatorResponse");
import BaseValidator = require("./BaseValidator");
/**
 * sprawdza czy parametr string ma znaki 0-9
 */
class IsNumericValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsNumericValidator";
	public message = "The input may contain only 0-9";
	constructor(name:string){
		super(name);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isNumeric(value)){
			return true;
		}
		response.errorList = [{
			formatter: this.getErrorMessage(),
		}];
		return false;
	}
}
export = IsNumericValidator;
