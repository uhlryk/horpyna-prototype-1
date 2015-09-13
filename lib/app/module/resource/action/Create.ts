import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class Create extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name:string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.POST, name);
	}
	public onConstructor() {
	}
	public configProcessModel(){
		var processModel = new Core.Node.ProcessModel();
		this.setActionHandler(processModel.getActionHandler());

		var isUnvalid = new Core.Node.Request.IsValid([processModel]);
		isUnvalid.setNegation();
		var errorResponseCode = new Core.Node.Response.SendData([isUnvalid]);
		errorResponseCode.setStatus(422);
		var forwardToForm = new Core.Node.Response.Forward([isUnvalid]);
		forwardToForm.setTargetAction(this._module.createFormAction);

		var isValid = new Core.Node.Request.IsValid([processModel]);

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
export = Create;