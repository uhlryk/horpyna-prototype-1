import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class DeleteForm extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name:string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
		var idField: Core.Field.BaseField = new Core.Field.BaseField(this, "id", Core.Field.FieldType.PARAM_FIELD);
	}
	public configProcessModel(){
		var processModel = new Core.Node.ProcessModel();
		this.setActionHandler(processModel.getActionHandler());

		var formGenerator = new Core.Node.Form.Generate([processModel]);
		formGenerator.addFormAction(this._module.deleteAction);
		formGenerator.addFormAction(this._module.deleteFormAction);

		var findDbData = new Core.Node.Db.Find([processModel]);
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
		sendPopulateDataForm.setView("horpyna/jade/deleteFormAction");
	}
}
export = DeleteForm;