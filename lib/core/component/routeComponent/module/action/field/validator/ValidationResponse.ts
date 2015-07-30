import ValidatorResponse = require("./ValidatorResponse");

interface ValidationResponse {
	valid: boolean;
	responseValidatorList?: ValidatorResponse[];


}
export = ValidationResponse;