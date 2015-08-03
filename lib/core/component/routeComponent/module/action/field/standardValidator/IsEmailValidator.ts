import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
/**
 * sprawdza czy jest to data
 */
class IsEmailValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsEmailValidator";
	public message = "The input does not appear to be a valid email";
	constructor(name: string) {
		super(name, false);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isEmail(value)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsEmailValidator;
