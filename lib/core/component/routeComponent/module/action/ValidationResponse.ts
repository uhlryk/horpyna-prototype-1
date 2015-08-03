import ValidatorResponse = require("./field/ValidatorResponse");

interface ValidationResponse {
	valid: boolean;
	responseValidatorList?: ValidatorResponse[];


}
export = ValidationResponse;