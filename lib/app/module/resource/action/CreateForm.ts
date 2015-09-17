import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class CreateForm extends Core.Action.BaseAction {
	private _formGenerator : Core.Node.Form.Generate;
	private _view: string;
	constructor(parent: Core.Module, name:string) {
		super(parent, Core.Action.BaseAction.GET, name);
		this._view = "horpyna/jade/createFormAction";
	}
	public onConstructor() {
		var processModel = new Core.Node.ProcessModel(this);

		var getValidationMessage = new Core.Node.Request.GetData([processModel]);
		getValidationMessage.setKey("validationError");

		var ifValidationErrorDataExist = new Core.Node.Gateway.IfExist([getValidationMessage]);

		var ifNoValidationError = new Core.Node.Gateway.IfExist([getValidationMessage]);
		ifNoValidationError.setNegation();

		var errorResponseCode = new Core.Node.Response.SendData([ifValidationErrorDataExist]);
		errorResponseCode.setStatus(422);

		this._formGenerator = new Core.Node.Form.Generate([processModel]);

		var populateValidationMessage = new Core.Node.Form.PopulateValidation([this._formGenerator, ifValidationErrorDataExist]);
		populateValidationMessage.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateValidationMessage.setValidationMessage(Core.Node.SourceType.RESPONSE_NODE_2);

		var sendForm = new Core.Node.Response.SendData([populateValidationMessage]);
		sendForm.setView(this._view);

		var sendForm = new Core.Node.Response.SendData([this._formGenerator, ifNoValidationError]);
		sendForm.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		sendForm.setView(this._view);
	}
	public get formGenerator(): Core.Node.Form.Generate {
		return this._formGenerator;
	}
	public get view():string{
		return this._view;
	}
	public set view(v:string){
		this._view = v;
	}
}
export = CreateForm;