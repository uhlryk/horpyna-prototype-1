import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
/**
 * sprawdza czy parametr który jest liczbą w danym przedziale
 */
class IsFloatValidator extends BaseValidator {
	public VALIDATOR_NAME = "IsFloatValidator";
	private min: number;
	private max: number;
	public message = "The input is not float"
	public messageMin  = "The  input is lower than %d"
	public messageMinMax = "The input should be float between %d and %d";
	constructor(parent: Field.BaseField, name: string, min?: number, max?: number) {
		super(parent, name,false);
		this.min = min;
		this.max = max;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		var method = "isFloat";//jest to hack ponieważ definicja tej metody nie pozwala dodawać min i max, a implementacja to ma
		if (this.max && this.min) {
			if (Util.ValidatorList[method](value, { min:this.min, max:this.max })) {
				return true
			} else {
				response.errorList = [Util.NodeUtil.format(this.getErrorMessage(this.messageMinMax), this.min,this.max)];
				return false;
			}
		} else if (this.min) {
			if (Util.ValidatorList[method](value, { min: this.min })) {
				return true
			} else {
				response.errorList = [Util.NodeUtil.format(this.getErrorMessage(this.messageMin), this.min)];
				return false;
			}
		} else {
			if (Util.ValidatorList[method](value)) {
				return true
			} else {
				response.errorList = [Util.NodeUtil.format(this.getErrorMessage())];
				return false;
			}
		}
	}
}
export = IsFloatValidator;