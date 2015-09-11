import Core = require("../../../../index");
/**
 * Odpowiada za logikę tworzenia danych
 */
class OnFormCreateResource extends Core.Node.ProcessModel {
	private _module: Core.App.Module.Resource;
	constructor(module: Core.App.Module.Resource) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var getValidationMessage = new Core.Node.Request.GetData([this]);
		getValidationMessage.setKey("validationError");

		var ifValidationErrorDataExist = new Core.Node.Gateway.IfExist([getValidationMessage]);

		var ifNoValidationError = new Core.Node.Gateway.IfExist([getValidationMessage]);
		ifNoValidationError.setNegation();

		var errorResponseCode = new Core.Node.Response.SendData([ifValidationErrorDataExist]);
		errorResponseCode.setStatus(422);

		var formGenerator = new Core.Node.Form.Generate([this]);
		formGenerator.addFormAction(this._module.createAction);
		formGenerator.addFormAction(this._module.createFormAction);

		var populateValidationMessage = new Core.Node.Form.PopulateValidation([formGenerator, ifValidationErrorDataExist]);
		populateValidationMessage.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateValidationMessage.setValidationMessage(Core.Node.SourceType.RESPONSE_NODE_2);

		var sendForm = new Core.Node.Response.SendData([populateValidationMessage]);
		sendForm.setView("horpyna/jade/createFormAction");

		var sendForm = new Core.Node.Response.SendData([formGenerator, ifNoValidationError]);
		populateValidationMessage.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		sendForm.setView("horpyna/jade/createFormAction");
	}
}
export = OnFormCreateResource;