import ValidatorResponse = require("./ValidatorResponse");

interface ValidationResponse {
	valid: boolean;
	errorValidatorList?: ValidatorResponse[];


}
export = ValidationResponse;