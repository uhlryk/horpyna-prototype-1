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

		var getValidationMessage = new Core.Node.Request.GetData([isUnvalid]);
		getValidationMessage.setKey("validationError");

		var errorResponseCode = new Core.Node.Response.SendData([getValidationMessage]);
		errorResponseCode.setStatus(422);

		var isValid = new Core.Node.Request.IsValid([processModel]);

		var findDbData = new Core.Node.Db.Find([isValid]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var DataNotExistResponseCode = new Core.Node.Response.SendData([ifDataNotExist]);
		DataNotExistResponseCode.setStatus(422);

		var deleteDbData = new Core.Node.Db.Delete([ifDataExist]);
		deleteDbData.setModel(this._module.model);
		deleteDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		deleteDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var removeFiles = new Core.App.Node.RemoveFile([ifDataExist]);

		var finalResponseCode = new Core.Node.Response.SendData([findDbData]);
		finalResponseCode.setStatus(200);
	}
}
export = Delete;