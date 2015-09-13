import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy jest to data
 */
class IsDateValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsDateValidator";
	public message = "The input does not appear to be a valid date";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name,false);
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
