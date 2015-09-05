import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę akcji edycji danych
 */
class OnUpdateResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var isUnvalid = new Core.Node.Request.IsValid([this]);
		isUnvalid.setNegation();
		var errorResponseCode = new Core.Node.Response.SendData([isUnvalid]);
		errorResponseCode.setStatus(422);

		var isValid = new Core.Node.Request.IsValid([this]);

		var findDbData = new Core.Node.Db.Find([isValid]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		var fileSavePrepare = new Core.App.Node.FileToSave([isValid]);
		fileSavePrepare.setAction(this._module.fileAction);

		var fileUpdatePrepare = new Core.App.Node.FileToUpdate([ifDataExist, fileSavePrepare]);
		fileUpdatePrepare.setNewData(Core.Node.SourceType.BODY_FIELD);
		fileUpdatePrepare.setExistingSource(Core.Node.SourceType.RESPONSE_NODE_1);
		fileUpdatePrepare.setNewFileSource(Core.Node.SourceType.RESPONSE_NODE_2);

		var updateDbData = new Core.Node.Db.Update([fileUpdatePrepare]);
		updateDbData.setModel(this._module.model);
		updateDbData.addData(Core.Node.SourceType.BODY_FIELD);
		updateDbData.addData(Core.Node.SourceType.RESPONSE_NODE);
		updateDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		updateDbData.addWhere(Core.Node.SourceType.APP_FIELD);

		var redirectAction = new Core.Node.Response.Redirect([updateDbData]);
		redirectAction.setTargetAction(this._module.listAction);

		var navSendDataNode = new Core.Node.Response.SendData([fileUpdatePrepare,updateDbData]);
	}
}
export = OnUpdateResource;