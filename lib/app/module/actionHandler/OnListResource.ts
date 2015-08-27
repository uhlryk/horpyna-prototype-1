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

		//O => Find	=> ObjectToElement => FileLinks
		var fileLinksNode = new Core.Node.Transform.FileLinks([objectElementNode]);
		fileLinksNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);

		//O => Find	=> ObjectToElement => FileLinks => ActionLink
		var addActionLinksNode = new Core.Node.Transform.ActionLink([fileLinksNode]);
		addActionLinksNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		addActionLinksNode.addAction(this._module.updateAction.formAction);
		addActionLinksNode.addAction(this._module.deleteAction.formAction);
		addActionLinksNode.addAction(this._module.detailAction);

		//O => Find	=> ObjectToElement => FileLinks => ActionLink => ElementToObject
		var actionNavNode = new Core.Node.Transform.ElementToObject([addActionLinksNode]);
		actionNavNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		actionNavNode.setKey("nav");

		//O => Find	=> ObjectToElement => FileLinks => ActionLink => ElementToObject => CombineObject
		//O => Find	=> ObjectToElement => FileLinks => CombineObject
		var combineNode = new Core.Node.Transform.AdditionCombine([fileLinksNode, actionNavNode]);
		combineNode.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE_1);
		combineNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		combineNode.addSecondarySource(Core.Node.NodeMapper.RESPONSE_NODE_2);
		combineNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);

		//combineNode => SendData => X
		var sendDataNode = new Core.Node.Response.SendData([combineNode]);
		sendDataNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		sendDataNode.setView("horpyna/jade/listAction");

		//O => Find	=> ObjectToElement => UniqueKeyObject
		var keyListNode = new Core.Node.Transform.UniqueKey([objectElementNode]);
		keyListNode.setKey("o");

		//O => Find	=> ObjectToElement => UniqueKeyObject => SendData => X
		var orderSendDataNode = new Core.Node.Response.SendData([keyListNode]);
		orderSendDataNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		orderSendDataNode.setResponseKey("order");

		//O => Empty
		var emptyNode = new Core.Node.Transform.Empty([this]);
		// this.addChildNode(emptyNode);

		//O => Empty => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([emptyNode]);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);

		//O => Empty => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		navSendDataNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		navSendDataNode.setResponseKey("navigation");
	}
}
export = OnListResource;