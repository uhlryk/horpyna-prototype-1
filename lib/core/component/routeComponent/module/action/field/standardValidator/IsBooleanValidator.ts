import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
/**
 * sprawdza czy parametr string ma znaki 'true' | 'false' | '0' | '1'
 */
class IsBooleanValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsBooleanValidator";
	public message = "The input may contain only boolean values";
	constructor(name: string) {
		super(name, false);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList['isBoolean'](value)) {
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsBooleanValidator;
