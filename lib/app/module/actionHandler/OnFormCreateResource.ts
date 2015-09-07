import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę tworzenia danych
 */
class OnFormCreateResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var getValidationMessage = new Core.Node.Request.GetData([this]);
		getValidationMessage.setKey("validationError");

		var ifValidationErrorDataExist = new Core.Node.Gateway.IfExist([getValidationMessage]);

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
	}
}
export = OnFormCreateResource;