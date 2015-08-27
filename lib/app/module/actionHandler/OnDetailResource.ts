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
		var findNode = new Core.Node.Db.Find([this]);
		findNode.setModel(this._module.model);
		findNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		findNode.addWhere(Core.Action.FieldType.APP_FIELD);

		//O => Find => If
		// var ifNode = new Core.Node.Gateway.IfExist(this, [findNode]);
		// findNode.addChildNode(ifNode);

		//O => Find => If -> Redirect
		// var redirectNode = new Core.Node.Response.Redirect(this);
		// ifNode.addNegativeChildNode(redirectNode);
		// redirectNode.setTargetAction(this._module.listAction);

		//O => Find => If +> FileLinks
		var fileLinksNode = new Core.Node.Transform.FileLinks([findNode]);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);

		//O => Find => If +> FileLinks => ActionLink
		var addActionLinksNode = new Core.Node.Transform.ActionLink([fileLinksNode]);
		addActionLinksNode.addAction(this._module.updateAction.formAction);
		addActionLinksNode.addAction(this._module.deleteAction.formAction);

		//O => Find => If +> FileLinks => ActionLink => ElementToObject
		var actionNavNode = new Core.Node.Transform.ElementToObject([addActionLinksNode]);
		actionNavNode.setKey("nav");

		//O => Find => If +> FileLinks => ActionLink => ElementToObject => CombineObject
		//O => Find => If +> FileLinks => CombineObject
		var combineNode = new Core.Node.Transform.AdditionCombine([fileLinksNode, actionNavNode]);
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