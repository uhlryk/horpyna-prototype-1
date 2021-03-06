import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr który jest stringiem ma dany fragment
 */
class ContainsValidator extends BaseValidator {
	public VALIDATOR_NAME = "ContainsValidator";
	private seed: string;
	public message = "The input not contain '%s'";
	constructor(parent: Field.BaseField, name: string, seed: string) {
		super(parent, name,false);
		this.seed = seed;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.contains(value, this.seed)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage(), this.seed)];
		return false;
	}
}
export = ContainsValidator;
