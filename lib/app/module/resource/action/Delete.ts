import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class Delete extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name:string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.POST, name);
	}
	public onConstructor() {
		var idField: Core.Field.BaseField = new Core.Field.BaseField(this, "id", Core.Field.FieldType.PARAM_FIELD);
	}
	public configProcessModel(){
		var processModel = new Core.Node.ProcessModel(this);

		var isUnvalid = new Core.Node.Request.IsValid([processModel]);
		isUnvalid.setNegation();
		var errorResponseCode = new Core.Node.Response.SendData([isUnvalid]);
		errorResponseCode.setStatus(422);
		var forwardToForm = new Core.Node.Response.Forward([isUnvalid]);
		forwardToForm.setTargetAction(this._module.deleteFormAction);

		var isValid = new Core.Node.Request.IsValid([processModel]);

		var findDbData = new Core.Node.Db.Find([isValid]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		var deleteDbData = new Core.Node.Db.Delete([ifDataExist]);
		deleteDbData.setModel(this._module.model);
		deleteDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		deleteDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var removeFiles = new Core.App.Node.RemoveFile([ifDataExist]);

		var redirectAction = new Core.Node.Response.Redirect([findDbData]);
		redirectAction.setTargetAction(this._module.listAction);

		var navSendDataNode = new Core.Node.Response.SendData([findDbData]);
	}
}
export = Delete;