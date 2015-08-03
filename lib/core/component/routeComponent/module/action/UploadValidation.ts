import Action = require("./Action");
import Field = require("./field/Field");
import BaseValidator = require("./field/BaseValidator");
import ValidationResponse = require("./ValidationResponse");
import ValidatorResponse = require("./field/ValidatorResponse");
import FieldType = require("./field/FieldType");
import Util = require("./../../../../util/Util");
import Element = require("./../../../../Element");
/**
 * Odpowiada za przeprowadzenie procesu walidacji przy uploadzie pojedyńczego pliku
 */
class UploadValidation extends Element {
	private action: Action.BaseAction;
	private _file: any;
	private validationResponse: ValidationResponse;
	private _field: string;
	constructor(action:Action.BaseAction, file, field:string){
		super();
		this.action = action;
		this._file = file;
		this.validationResponse = <ValidationResponse>{};
		this.validationResponse.valid = true;
		this.validationResponse.responseValidatorList = [];
		this._field = field;
		this.initDebug("uploadValidation");
	}
	private validateValidators(): void {
		this.debug('validateValidators');
		var field: Field = this.action.getField(FieldType.FILE_FIELD, this._field);
		var validatorList: BaseValidator[] = field.getValidatorList();
		this.debug("field name: %s, value: %s", field.name, this._file);
		for (var i = 0; i < validatorList.length; i++){
			var validator: BaseValidator = validatorList[i];
		// return Util.Promise.map(validatorList, (validator: BaseValidator) => {
			if(validator.validationPhase !== BaseValidator.PREUPLOAD_PHASE){
				continue;
			}
			// return new Util.Promise<ValidatorResponse>((resolve: (ValidatorResponse) => void) => {
			validator.validate(this._file, null, function(response: ValidatorResponse) {
					this.debug("validator name: %s", validator.name);
					if (response.valid === false) {
						this.debug(response.valid);
						this.validationResponse.valid = false;
					}
					this.validationResponse.responseValidatorList.push(response);
				});
			// })
			// .then((response:ValidatorResponse)=>{

			// });
		};
	}
	public validate(): ValidationResponse {

		this.validateValidators();
		return this.validationResponse;

	}
}
export = UploadValidation;