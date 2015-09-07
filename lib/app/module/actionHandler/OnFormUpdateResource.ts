import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę wyświetlania danych do edycji danych
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

		var ifNoValidationError = new Core.Node.Gateway.IfExist([getValidationMessage]);
		ifNoValidationError.setNegation();

		var formGenerator = new Core.Node.Form.Generate([this]);
		formGenerator.addFormAction(this._module.createAction);
		formGenerator.addFormAction(this._module.createFormAction);

		var findDbData = new Core.Node.Db.Find([ifNoValidationError]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		//wypełniamy formularz danymi które błędnie były wysłane
		var populateValidationMessage = new Core.Node.Form.PopulateValidation([formGenerator, ifValidationErrorDataExist]);
		populateValidationMessage.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateValidationMessage.setValidationMessage(Core.Node.SourceType.RESPONSE_NODE_2);
		var sendValidationForm = new Core.Node.Response.SendData([populateValidationMessage]);
		sendValidationForm.setView("horpyna/jade/createFormAction");
		//wypełniamy formularz danymi z bazy
		var populateData = new Core.Node.Form.PopulateData([formGenerator, ifDataExist]);
		populateData.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateData.setFormData(Core.Node.SourceType.RESPONSE_NODE_2);
		var sendPopulateDataForm = new Core.Node.Response.SendData([populateData]);
		sendPopulateDataForm.setView("horpyna/jade/createFormAction");
	}
}
export = OnFormCreateResource;