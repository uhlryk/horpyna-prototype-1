import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../process/AddActionLinkToEach");
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
		var listNode = new Core.Node.Db.List([this]);
		listNode.setModel(this._module.model);
		listNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		listNode.addWhere(Core.Action.FieldType.APP_FIELD);
		listNode.setOrder(Core.Action.FieldType.QUERY_FIELD,"o");
		listNode.setDirection(Core.Action.FieldType.QUERY_FIELD,"d");
		listNode.setPage(Core.Action.FieldType.QUERY_FIELD,"p");
		listNode.setSize(Core.Action.FieldType.QUERY_FIELD,"s");
//O => Find	=> ObjectToElement
		var objectElementNode = new Core.Node.Transform.ObjectToElement([listNode]);
		objectElementNode.elementKey("list");
//O => Find	=> ObjectToElement => JoinArray
		var joinToOneList = new Core.Node.Transform.JoinArray([objectElementNode]);
//O => Find	=> ObjectToElement => JoinArray=> FileLinks
		var fileLinksNode = new Core.Node.Transform.FileLinks([joinToOneList]);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);
//O => Find	=> ObjectToElement => JoinArray=> FileLinks => AddActionLinkToEach
		var addActionLinkToListElement = new AddActionLinkToEach([fileLinksNode]);
		addActionLinkToListElement.addAction(this._module.updateAction.formAction);
		addActionLinkToListElement.addAction(this._module.deleteAction.formAction);
		addActionLinkToListElement.addAction(this._module.detailAction);
//O => Find	=> ObjectToElement => JoinArray=> ileLinks => AddActionLinkToEach => SendData => X
		var sendDataNode = new Core.Node.Response.SendData([addActionLinkToListElement]);
		sendDataNode.setView("horpyna/jade/listAction");
//O => Find	=> ObjectToElement => UniqueKeyObject
		var keyListNode = new Core.Node.Transform.UniqueKey([joinToOneList]);
		keyListNode.setKey("o");
//O => Find	=> ObjectToElement => UniqueKeyObject => SendData => X
		var orderSendDataNode = new Core.Node.Response.SendData([keyListNode]);
		orderSendDataNode.setResponseKey("order");
//O => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([this]);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);
//O => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		navSendDataNode.setResponseKey("navigation");
	}
}
export = OnListResource;