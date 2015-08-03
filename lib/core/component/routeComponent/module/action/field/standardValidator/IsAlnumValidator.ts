import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
/**
 * sprawdza czy parametr string ma znaki a-zA-Z0-9
 */
class IsAlnumValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsAlnumValidator";
	public message = "The input may contain only a-zA-Z0-9";
	constructor(name: string) {
		super(name, false);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isAlphanumeric(value)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsAlnumValidator;
