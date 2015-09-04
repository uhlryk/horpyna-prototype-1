import Core = require("../../../index");
/**
 * Wyświetla formularz do dodania nowego wpisu. Formularz generowany jest przez specjalną akcję FormAction
 */
class OnFormCreateResource extends Core.Action.ActionHandlerController {
	private _viewPath: string;
	constructor(viewPath: string) {
		super();
		this._viewPath = viewPath;
		this.setActionHandler((request, response, action) => { return this.actionHandler(request, response, action); });
	}
	protected actionHandler(request: Core.Action.Request, response: Core.Action.Response, action: Core.Action.BaseAction): Core.Util.Promise<void> {
		return Core.Util.Promise.resolve()
		.then(() => {
			var content = response.content;
			var form: Core.Form.IForm = content["form"];
			var fieldList: Core.Form.IInputForm[] = form.fields;
			var validationResponse: Core.Action.ValidationResponse = <Core.Action.ValidationResponse>response.getData("validationError");
			if (validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
				form.valid = false;
				for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
					var validatorResponse: Core.Validator.ValidatorResponse = validationResponse.responseValidatorList[i];
					for (var j = 0; j < fieldList.length; j++) {
						var field: Core.Form.IInputForm = fieldList[j];
						if (field.name === validatorResponse.field) {
							field.value = validatorResponse.value;
							field.valid = validatorResponse.valid;
							if (validatorResponse.valid === false) {
								field.errorList = field.errorList.concat(validatorResponse.errorList);
							}
						}
					}
				}
			}
			response.view = this._viewPath;
		});
	}
}
export = OnFormCreateResource;