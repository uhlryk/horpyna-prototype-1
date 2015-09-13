import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr string ma znaki a-zA-Z
 */
class IsAlphaValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsAlphaValidator";
	public message = "The input may contain only a-zA-Z";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name,false);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isAlpha(value)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsAlphaValidator;
