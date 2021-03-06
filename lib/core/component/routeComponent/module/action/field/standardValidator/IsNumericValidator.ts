import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr string ma znaki 0-9
 */
class IsNumericValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsNumericValidator";
	public message = "The input may contain only 0-9";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name, false);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isNumeric(value)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsNumericValidator;
