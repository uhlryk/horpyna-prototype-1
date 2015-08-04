import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
/**
 * Waliduje rozmiar pliku, jeśli
 */
class SizeValidator extends BaseValidator {
	public VALIDATOR_NAME = "SizeValidator";
	private min: number;
	private max: number;
	public messageMin = "The input is less than %s bytes size"
	public messageMax = "The input is more than %s bytes size";

	constructor(name: string, min: number, max: number, validationPhase?: string) {
		super(name, true, validationPhase);
		if (!validationPhase){
			validationPhase = BaseValidator.POSTUPLOAD_PHASE;
		}
		this.min = min;
		this.max = max;
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		var valueList = [];
		if(Array.isArray(value)=== false){
			valueList = [value]
		} else{
			valueList = value;
		}
		var valid = true;
		for (var i = 0; i < valueList.length; i++){
			var file = valueList[i];
			if (file.size < this.min) {
				response.errorList = [Util.NodeUtil.format(this.getErrorMessage(this.messageMin), this.min)];
				valid = false;
			} else if (file.size > this.max) {
				response.errorList = [Util.NodeUtil.format(this.getErrorMessage(this.messageMax), this.max)];
				valid = false;
			}
		}
		return valid;
	}
}
export = SizeValidator;
