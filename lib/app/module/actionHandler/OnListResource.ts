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

		//O => Find
		var listNode = new Core.Node.Db.List(this);
		this.addChildNode(listNode);
		listNode.setModel(this._module.model);
		listNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		listNode.addWhere(Core.Action.FieldType.APP_FIELD);
		listNode.setOrder(Core.Action.FieldType.QUERY_FIELD,"o");
		listNode.setDirection(Core.Action.FieldType.QUERY_FIELD,"d");
		listNode.setPage(Core.Action.FieldType.QUERY_FIELD,"p");
		listNode.setSize(Core.Action.FieldType.QUERY_FIELD,"s");

		//O => Find	=> ObjectToElement
		var objectElementNode = new Core.Node.Modify.ObjectToElement(this);
		listNode.addChildNode(objectElementNode);
		objectElementNode.elementKey("list");

		//O => Find	=> ObjectToElement => FileLinks
		var fileLinksNode = new Core.Node.Modify.FileLinks(this);
		objectElementNode.addChildNode(fileLinksNode);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);

		//O => Find	=> ObjectToElement => FileLinks => ActionLink
		var addActionLinksNode = new Core.Node.Modify.ActionLink(this);
		fileLinksNode.addChildNode(addActionLinksNode);
		addActionLinksNode.addAction(this._module.updateAction.formAction);
		addActionLinksNode.addAction(this._module.deleteAction.formAction);
		addActionLinksNode.addAction(this._module.detailAction);

		//O => Find	=> ObjectToElement => FileLinks => ActionLink => SendData => X
		var sendDataNode = new Core.Node.Response.SendData(this);
		// addActionLinksNode.addChildNode(sendDataNode);
		fileLinksNode.addChildNode(sendDataNode);
		sendDataNode.setView("horpyna/jade/listAction");

		//O => Find	=> ObjectToElement => UniqueKeyObject
		var keyListNode = new Core.Node.Modify.UniqueKeyList(this);
		objectElementNode.addChildNode(keyListNode);
		// keyListNode.addDataSource(Core.Node.BaseNode.NODE_RESPONSE);

		//O => Find	=> ObjectToElement => UniqueKeyObject => ElementToObject
		var elementToObjectNode = new Core.Node.Modify.ElementToObject(this);
		keyListNode.addChildNode(elementToObjectNode);
		elementToObjectNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		elementToObjectNode.setKey("o");

		//O => Find	=> ObjectToElement => UniqueKeyObject => SendData => X
		var orderSendDataNode = new Core.Node.Response.SendData(this);
		elementToObjectNode.addChildNode(orderSendDataNode);
		orderSendDataNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		orderSendDataNode.setResponseKey("order");

		//O => Empty
		var emptyNode = new Core.Node.Modify.Empty(this);
		this.addChildNode(emptyNode);

		//O => Empty => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Modify.ActionLink(this);
		emptyNode.addChildNode(addSecondaryActionLinksNode);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);

		//O => Empty => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData(this);
		addSecondaryActionLinksNode.addChildNode(navSendDataNode);
		navSendDataNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		navSendDataNode.setResponseKey("navigation");

	}
}
export = OnListResource;