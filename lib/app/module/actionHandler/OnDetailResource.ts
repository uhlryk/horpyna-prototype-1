import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class OnDetailResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {

		//O => Find
		var findDbData = new Core.Node.Db.Find([this]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Action.FieldType.PARAM_FIELD);
		findDbData.addWhere(Core.Action.FieldType.APP_FIELD);

		// O => Find => If
		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();

		//O => Find => If -> Redirect
		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);

		//O => Find => If +> FileLinks
		var createFileLink = new Core.Node.Transform.FileLinks([ifDataExist]);
		createFileLink.setFileAction(this._module.fileAction);
		createFileLink.mapActionParams(Core.Action.FieldType.PARAM_FIELD);

		//O => Find => If +> FileLinks => ActionLink
		var addActionsLinks = new Core.Node.Transform.ActionLink([createFileLink]);
		addActionsLinks.addAction(this._module.updateAction.formAction);
		addActionsLinks.addAction(this._module.deleteAction.formAction);

		//O => Find => If +> FileLinks => ActionLink => ElementToObject
		var actionNavNode = new Core.Node.Transform.ElementToObject([addActionsLinks]);
		actionNavNode.setKey("nav");

		//O => Find => If +> FileLinks => ActionLink => ElementToObject => CombineObject
		//O => Find => If +> FileLinks => CombineObject
		var combineNode = new Core.Node.Transform.AdditionCombine([createFileLink, actionNavNode]);
		combineNode.addFirstChannel(Core.Node.NodeMapper.RESPONSE_NODE_1);
		combineNode.addSecondChannel(Core.Node.NodeMapper.RESPONSE_NODE_2);

		//CombineObject => SendData	=> X
		var sendDataNode = new Core.Node.Response.SendData([combineNode]);
		sendDataNode.setView("horpyna/jade/detailAction");

		//O => Empty
		var emptyNode = new Core.Node.Transform.Empty([this]);

		//O => Empty => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([emptyNode]);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);
		addSecondaryActionLinksNode.addAction(this._module.listAction);

		//O => Empty => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		navSendDataNode.setResponseKey("navigation");
	}
}
export = OnDetailResource;