import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
/**
 * Obsługuje generowanie listy wartości z bazy danych
 * Obsługuje sortowanie i paginacje,
 */
class OnListResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var listNode = new Core.Node.Db.List(this);
		var ifNode = new Core.Node.Gateway.IfExist(this);
		var fileLinksNode = new Core.Node.Modify.FileLinks(this);
		var addActionLinksNode = new Core.Node.Modify.AddActionLinks(this);
		var addSecondaryActionLinksNode = new Core.Node.Modify.AddActionLinks(this);
		var navSendDataNode = new Core.Node.Response.SendData(this);
		var emptyNode = new Core.Node.Modify.Empty(this);
		var getObjectElementNode = new Core.Node.Modify.GetObjectElement(this);
		var sendDataNode = new Core.Node.Response.SendData(this);

		this.addChildNode(emptyNode);
		emptyNode.addChildNode(addSecondaryActionLinksNode);
		addSecondaryActionLinksNode.addActionAfterAll(this._module.createAction.formAction, [{ type: Core.Action.FieldType.PARAM_FIELD }]);
		addSecondaryActionLinksNode.addChildNode(navSendDataNode);
		navSendDataNode.setResponseKey("navigation");

		this.addChildNode(listNode);
		listNode.setModel(this._module.model);
		listNode.addWhere(Core.Action.FieldType.APP_FIELD);
		listNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		listNode.setOrder(Core.Action.FieldType.QUERY_FIELD,"o");
		listNode.setDirection(Core.Action.FieldType.QUERY_FIELD,"d");
		listNode.setPage(Core.Action.FieldType.QUERY_FIELD,"p");
		listNode.setSize(Core.Action.FieldType.QUERY_FIELD,"s");
		listNode.addChildNode(getObjectElementNode);
		getObjectElementNode.elementKey("list");
		getObjectElementNode.addChildNode(fileLinksNode);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);
		fileLinksNode.addChildNode(addActionLinksNode);
		addActionLinksNode.addActionAfterAll(this._module.updateAction.formAction, [{ type: Core.Node.BaseNode.NODE_RESPONSE }]);
		addActionLinksNode.addActionAfterAll(this._module.deleteAction.formAction, [{ type: Core.Node.BaseNode.NODE_RESPONSE }]);
		addActionLinksNode.addActionAfterAll(this._module.detailAction, [{ type: Core.Node.BaseNode.NODE_RESPONSE }]);
		addActionLinksNode.addChildNode(sendDataNode);
		sendDataNode.setView("horpyna/jade/listAction");
	}
}
export = OnListResource;