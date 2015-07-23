import ValidatorResponse = require("./ValidatorResponse");
import BaseValidator = require("./BaseValidator");
import Util = require("../../../../../../util/Util");
/**
 * sprawdza czy parametr który jest liczbą całkowitą
 */
class IsIntValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsIntValidator";
	private min: number;
	private max: number;
	public message = "The input must be int";
	constructor(name:string){
		super(name);
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (Util.ValidatorList.isInt(value)) {
			return true;
		}
		response.errorList = [{
			formatter: this.getErrorMessage(),
		}];
		return false;
	}
}
export = IsIntValidator;
