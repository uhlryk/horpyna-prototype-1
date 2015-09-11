import Core = require("../../../../index");
/**
/**
 * Odpowiada za logikę akcji szczegółów
 */
class OnFileResource extends Core.Node.ProcessModel {
	private _module: Core.App.Module.Resource;
	constructor(module: Core.App.Module.Resource) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
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

		var fileToShow = new Core.App.Node.FileToData([ifDataExist]);
		fileToShow.setColumn(Core.Node.SourceType.QUERY_FIELD, "column");
		fileToShow.setCount(Core.Node.SourceType.QUERY_FIELD, "count");
		fileToShow.setFileSource(Core.Node.SourceType.RESPONSE_NODE);

		var downloadFile = new Core.Node.Response.Download([fileToShow]);
	}
}
export = OnFileResource;