import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr string jest równy innej wartości (jeśli nie jest stringiem to zostanie zamieniona)
 */
class EqualsValidator extends BaseValidator {
	public VALIDATOR_NAME = "EqualsValidator";
	private comparison: string;
	public message = "The input not equal '%s'";
	constructor(parent: Field.BaseField, name: string, comparison: string) {
		super(parent, name,false);
		this.comparison = comparison;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.equals(value, this.comparison)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage(), this.comparison)];
		return false;
	}
}
export = EqualsValidator;
