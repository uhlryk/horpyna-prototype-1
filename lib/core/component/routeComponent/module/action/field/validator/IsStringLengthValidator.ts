import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./ValidatorResponse");
import BaseValidator = require("./BaseValidator");
/**
 * sprawdza czy parametr który jest stringiem ma dany rozmiar
 */
class IsStringLengthValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsStringLengthValidator";
	private min: number;
	private max: number;
	public messageMin = "The input is less than %s characters long"
	public messageMax = "The input is more than %s characters long";
	constructor(name:string, min:number, max?:number){
		super(name);
		this.min = min;
		this.max = max;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		if (value.length < this.min){
			response.errorList = [Util.NodeUtil.format(this.getErrorMessage(this.messageMin), this.min)];
			return false;
		} else if (typeof this.max !== 'undefined' && value.length > this.max) {
			response.errorList = [Util.NodeUtil.format(this.getErrorMessage(this.messageMax), this.max)];
			return false;
		}
		return true;
	}
}
export = IsStringLengthValidator;
