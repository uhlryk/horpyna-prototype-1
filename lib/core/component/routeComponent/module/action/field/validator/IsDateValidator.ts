import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./ValidatorResponse");
import BaseValidator = require("./BaseValidator");
/**
 * sprawdza czy jest to data
 */
class IsDateValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsDateValidator";
	public message = "The input does not appear to be a valid date";
	constructor(name:string){
		super(name);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isDate(value)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsDateValidator;
