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
		var findNode = new Core.Node.Db.Find(this);
		var ifNode = new Core.Node.Gateway.IfExist(this);
		var redirectNode = new Core.Node.Response.Redirect(this);
		var fileLinksNode = new Core.Node.Modify.FileLinks(this);
		var sendDataNode = new Core.Node.Response.SendData(this);
		var addActionLinksNode = new Core.Node.Modify.AddActionLinks(this);
		var addSecondaryActionLinksNode = new Core.Node.Modify.AddActionLinks(this);
		var navSendDataNode = new Core.Node.Response.SendData(this);
		var EmptyNode = new Core.Node.Modify.Empty(this);

		this.addChildNode(EmptyNode);
		EmptyNode.addChildNode(addSecondaryActionLinksNode);
		addSecondaryActionLinksNode.addActionAfterAll(this._module.createAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addSecondaryActionLinksNode.addActionAfterAll(this._module.listAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addSecondaryActionLinksNode.addChildNode(navSendDataNode);
		navSendDataNode.setResponseKey("navigation");

		this.addChildNode(findNode);
		findNode.setModel(this._module.model);
		findNode.addWhere(Core.Action.FieldType.APP_FIELD);
		findNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		findNode.addChildNode(ifNode);
		ifNode.addNegativeChildNode(redirectNode);
		redirectNode.setTargetAction(this._module.listAction);
		ifNode.addPositiveChildNode(fileLinksNode);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);
		fileLinksNode.addChildNode(addActionLinksNode);
		addActionLinksNode.addActionAfterAll(this._module.updateAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addActionLinksNode.addActionAfterAll(this._module.deleteAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addActionLinksNode.addChildNode(sendDataNode);
		sendDataNode.setView("horpyna/jade/detailAction");
	}
}
export = OnDetailResource;