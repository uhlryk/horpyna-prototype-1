import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr który jest stringiem ma dany fragment
 */
class IsInValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsInValidator";
	private values: any[];
	public message = "The input was not found in the haystack";
	constructor(parent: Field.BaseField, name: string, values: any[]) {
		super(parent, name,false);
		this.values = values;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isIn(value, this.values)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = IsInValidator;
