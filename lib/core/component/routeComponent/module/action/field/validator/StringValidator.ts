import BaseValidator = require("./BaseValidator");
/**
 * Sprawdza czy parametr istnieje
 */
class StringValidator extends BaseValidator{
	static ValidatorName:string = "StringValidator";
	constructor(){
		super(StringValidator.ValidatorName);
	}
}
export = StringValidator;