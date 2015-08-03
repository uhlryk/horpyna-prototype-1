import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
/**
 * sprawdza czy parametr string ma znaki a-zA-Z0-9
 */
class MimeTypeValidator extends BaseValidator {
	public VALIDATOR_NAME = "MimeTypeValidator";
	public message = "Wrong file mime type";
	constructor(name: string, validationPhase:string) {
		super(name, true, validationPhase);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isAlphanumeric(value)){
			return true;
		}
		response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
		return false;
	}
}
export = MimeTypeValidator;
