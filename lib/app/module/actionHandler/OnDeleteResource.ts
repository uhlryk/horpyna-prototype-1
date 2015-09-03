import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import RemoveFile = require("./../../node/RemoveFile");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class OnDeleteResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var findDbData = new Core.Node.Db.Find([this]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Action.FieldType.PARAM_FIELD);
		findDbData.addWhere(Core.Action.FieldType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		var deleteDbData = new Core.Node.Db.Delete([ifDataExist]);
		deleteDbData.setModel(this._module.model);
		deleteDbData.addWhere(Core.Action.FieldType.PARAM_FIELD);
		deleteDbData.addWhere(Core.Action.FieldType.APP_FIELD);

		var removeFiles = new RemoveFile([ifDataExist]);

		var redirectAction = new Core.Node.Response.Redirect([findDbData]);
		redirectAction.setTargetAction(this._module.listAction);

		var navSendDataNode = new Core.Node.Response.SendData([findDbData]);
	}
}
export = OnDeleteResource;