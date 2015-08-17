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
		var findNode = new Core.Node.Db.Find(this);
		this.addChildNode(findNode);
		findNode.setModel(this._module.model);
		findNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		findNode.addWhere(Core.Action.FieldType.APP_FIELD);

		//O => Find => If
		var ifNode = new Core.Node.Gateway.IfExist(this);
		findNode.addChildNode(ifNode);

		//O => Find => If -> Redirect
		var redirectNode = new Core.Node.Response.Redirect(this);
		ifNode.addNegativeChildNode(redirectNode);
		redirectNode.setTargetAction(this._module.listAction);

		//O => Find => If +> FileLinks
		var fileLinksNode = new Core.Node.Modify.FileLinks(this);
		ifNode.addPositiveChildNode(fileLinksNode);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);

		//O => Find => If +> FileLinks => AddActionLinks
		var addActionLinksNode = new Core.Node.Modify.AddActionLinks(this);
		fileLinksNode.addChildNode(addActionLinksNode);
		addActionLinksNode.addActionAfterAll(this._module.updateAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addActionLinksNode.addActionAfterAll(this._module.deleteAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);

		//O => Find => If +> FileLinks => AddActionLinks => SendData	=> X
		var sendDataNode = new Core.Node.Response.SendData(this);
		addActionLinksNode.addChildNode(sendDataNode);
		sendDataNode.setView("horpyna/jade/detailAction");

		//O => Empty
		var emptyNode = new Core.Node.Modify.Empty(this);
		this.addChildNode(emptyNode);

		//O => Empty => AddActionLinks
		var addSecondaryActionLinksNode = new Core.Node.Modify.AddActionLinks(this);
		emptyNode.addChildNode(addSecondaryActionLinksNode);
		addSecondaryActionLinksNode.addActionAfterAll(this._module.createAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addSecondaryActionLinksNode.addActionAfterAll(this._module.listAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);

		//O => Empty => AddActionLinks => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData(this);
		addSecondaryActionLinksNode.addChildNode(navSendDataNode);
		navSendDataNode.setResponseKey("navigation");
	}
}
export = OnDetailResource;