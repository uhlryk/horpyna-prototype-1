import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class CreateForm extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name:string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
	}
	public configProcessModel(){
		var processModel = new Core.Node.ProcessModel();
		this.setActionHandler(processModel.getActionHandler());

		var getValidationMessage = new Core.Node.Request.GetData([processModel]);
		getValidationMessage.setKey("validationError");

		var ifValidationErrorDataExist = new Core.Node.Gateway.IfExist([getValidationMessage]);

		var ifNoValidationError = new Core.Node.Gateway.IfExist([getValidationMessage]);
		ifNoValidationError.setNegation();

		var errorResponseCode = new Core.Node.Response.SendData([ifValidationErrorDataExist]);
		errorResponseCode.setStatus(422);

		var formGenerator = new Core.Node.Form.Generate([processModel]);
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
export = CreateForm;