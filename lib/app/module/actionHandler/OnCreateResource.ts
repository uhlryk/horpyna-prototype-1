import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę tworzenia danych
 */
class OnCreateResource extends Core.Node.ProcessModel {
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

		var fileSavePrepare = new Core.App.Node.FileToSave([isValid]);
		fileSavePrepare.setAction(this._module.fileAction);

		var createDbData = new Core.Node.Db.Create([fileSavePrepare]);
		createDbData.setModel(this._module.model);
		createDbData.addData(Core.Node.SourceType.BODY_FIELD);
		createDbData.addData(Core.Node.SourceType.RESPONSE_NODE);
		createDbData.addData(Core.Node.SourceType.PARAM_FIELD);
		createDbData.addData(Core.Node.SourceType.APP_FIELD);

		var redirectAction = new Core.Node.Response.Redirect([createDbData]);
		redirectAction.setTargetAction(this._module.listAction);

		var navSendDataNode = new Core.Node.Response.SendData([createDbData]);
	}
}
export = OnCreateResource;