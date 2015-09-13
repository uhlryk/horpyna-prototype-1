import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr który jest stringiem ma dany fragment
 */
class MatchesValidator extends BaseValidator {
	public VALIDATOR_NAME = "MatchesValidator";
	private pattern: any;
	private modifiers: string;
	public message = "The input not match '%s' pattern";
	constructor(parent: Field.BaseField, name: string, pattern: any, modifiers?: string) {
		super(parent, name, false);
		this.pattern = pattern;
		this.modifiers = modifiers;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.matches(value, this.pattern, this.modifiers)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = MatchesValidator;
