import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class File extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name:string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
		new Core.Field.BaseField(this, "id", Core.Field.FieldType.PARAM_FIELD);
		new Core.Field.BaseField(this, "column", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		new Core.Field.BaseField(this, "count", Core.Field.FieldType.QUERY_FIELD, { optional: true });
	}
	public configProcessModel(){
		var processModel = new Core.Node.ProcessModel(this);

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

		var fileToShow = new Core.App.Node.FileToData([ifDataExist]);
		fileToShow.setColumn(Core.Node.SourceType.QUERY_FIELD, "column");
		fileToShow.setCount(Core.Node.SourceType.QUERY_FIELD, "count");
		fileToShow.setFileSource(Core.Node.SourceType.RESPONSE_NODE);

		var downloadFile = new Core.Node.Response.Download([fileToShow]);
	}
}
export = File;