import Core = require("../../../../index");
/**
 * Odpowiada za wyświetlanie formularza z danymi które zostaną usunięte
 */
class OnFormDelete extends Core.Node.ProcessModel {
	private _module: Core.App.Module.Resource;
	constructor(module: Core.App.Module.Resource) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var formGenerator = new Core.Node.Form.Generate([this]);
		formGenerator.addFormAction(this._module.deleteAction);
		formGenerator.addFormAction(this._module.deleteFormAction);

		var findDbData = new Core.Node.Db.Find([this]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		var navSendDataNode = new Core.Node.Response.SendData([ifDataExist]);
		navSendDataNode.setResponseKey("detail");

		var populateData = new Core.Node.Form.PopulateData([formGenerator, ifDataExist]);
		populateData.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		populateData.setFormData(Core.Node.SourceType.RESPONSE_NODE_2);

		var sendPopulateDataForm = new Core.Node.Response.SendData([populateData]);
		sendPopulateDataForm.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE);
		sendPopulateDataForm.setStatus(200);
		sendPopulateDataForm.setView("horpyna/jade/createFormAction");
	}
}
export = OnFormDelete;