import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class Detail extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name:string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
		var idField: Core.Field.BaseField = new Core.Field.BaseField(this, "id", Core.Field.FieldType.PARAM_FIELD);
	}
	public configProcessModel(){
		var processModel = new Core.Node.ProcessModel(this);

		var findDbData = new Core.Node.Db.Find([processModel]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var errorResponseCode = new Core.Node.Response.SendData([ifDataNotExist]);
		errorResponseCode.setStatus(422);
		// var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		// redirectAction.setTargetAction(this._module.listAction);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);

		var addActionLinkToListElement = new Core.App.Node.AddActionLinkToEach([ifDataExist]);
		addActionLinkToListElement.addAction(this._module.updateAction);
		addActionLinkToListElement.addAction(this._module.deleteAction);

		var sendDataNode = new Core.Node.Response.SendData([addActionLinkToListElement]);
		sendDataNode.setStatus(200);

		// var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([processModel]);
		// addSecondaryActionLinksNode.addAction(this._module.createFormAction);
		// addSecondaryActionLinksNode.addAction(this._module.listAction);

		// var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		// navSendDataNode.setResponseKey("navigation");
	}
}
export = Detail;