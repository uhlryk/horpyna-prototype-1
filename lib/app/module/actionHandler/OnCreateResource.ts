import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class OnCreateResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var fileSavePrepare = new Core.App.Node.FileToSave([this]);
		fileSavePrepare.setAction(this._module.fileAction);
		fileSavePrepare.setFileSource(Core.Action.FieldType.FILE_FIELD);

		var createDbData = new Core.Node.Db.Create([fileSavePrepare]);
		createDbData.setModel(this._module.model);
		createDbData.addData(Core.Action.FieldType.BODY_FIELD);
		createDbData.addData(Core.Node.NodeMapper.RESPONSE_NODE);
		createDbData.addData(Core.Action.FieldType.PARAM_FIELD);
		createDbData.addData(Core.Action.FieldType.APP_FIELD);

		var redirectAction = new Core.Node.Response.Redirect([createDbData]);
		redirectAction.setTargetAction(this._module.listAction);

		var navSendDataNode = new Core.Node.Response.SendData([createDbData]);
	}
}
export = OnCreateResource;