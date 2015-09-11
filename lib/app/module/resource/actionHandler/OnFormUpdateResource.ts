import Core = require("../../../../index");
/**
 * Odpowiada za logikę wyświetlania danych do edycji danych
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

		var formGenerator = new Core.Node.Form.Generate([this]);
		formGenerator.addFormAction(this._module.updateAction);
		formGenerator.addFormAction(this._module.updateFormAction);

		var findDbData = new Core.Node.Db.Find([this]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		var populateData = new Core.Node.Form.PopulateData([formGenerator, ifDataExist]);
		populateData.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateData.setFormData(Core.Node.SourceType.RESPONSE_NODE_2);

		//wypełniamy formularz danymi które błędnie były wysłane
		var populateValidationMessage = new Core.Node.Form.PopulateValidation([populateData, ifValidationErrorDataExist]);
		populateValidationMessage.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateValidationMessage.setValidationMessage(Core.Node.SourceType.RESPONSE_NODE_2);
		var sendValidationForm = new Core.Node.Response.SendData([populateValidationMessage]);
		sendValidationForm.setStatus(422);
		sendValidationForm.setView("horpyna/jade/createFormAction");

		var sendPopulateDataForm = new Core.Node.Response.SendData([populateData, ifNoValidationError]);
		sendPopulateDataForm.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		sendPopulateDataForm.setStatus(200);
		sendPopulateDataForm.setView("horpyna/jade/createFormAction");
	}
}
export = OnFormCreateResource;