import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import FileToData = require("./../../node/FileToData");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class OnFileResource extends Core.Node.ProcessModel {
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

		var fileToShow = new FileToData([ifDataExist]);
		fileToShow.setColumn(Core.Action.FieldType.QUERY_FIELD, "column");
		fileToShow.setCount(Core.Action.FieldType.QUERY_FIELD, "count");
		fileToShow.setFileSource(Core.Node.NodeMapper.RESPONSE_NODE);

		var downloadFile = new Core.Node.Response.Download([fileToShow]);
	}
}
export = OnFileResource;