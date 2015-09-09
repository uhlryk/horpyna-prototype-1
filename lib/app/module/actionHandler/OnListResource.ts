import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
import SortLinks = require("./../../node/SortLinks");
import Pagination = require("./../../node/Pagination");
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
		var isValid = new Core.Node.Request.IsValid([this]);
//O => Find
		var listNode = new Core.Node.Db.List([isValid]);
		listNode.setModel(this._module.model);
		listNode.addWhere(Core.Node.SourceType.PARAM_FIELD);
		listNode.addWhere(Core.Node.SourceType.APP_FIELD);
		listNode.setOrder(Core.Node.SourceType.QUERY_FIELD, "o");
		listNode.setDirection(Core.Node.SourceType.QUERY_FIELD, "d");
		listNode.setPage(Core.Node.SourceType.QUERY_FIELD, "p");
		listNode.setSize(Core.Node.SourceType.QUERY_FIELD, "s");
//O => Find	=> ObjectToElement
		var objectElementNode = new Core.Node.Transform.ObjectToElement([listNode]);
		objectElementNode.elementKey("list");
//O => Find	=> ObjectToElement => JoinArray
		var joinToOneList = new Core.Node.Transform.JoinArray([objectElementNode]);
//O => Find	=> ObjectToElement => JoinArray=> FileLinks
		// var fileLinksNode = new Core.Node.Transform.FileLinks([joinToOneList]);
		// fileLinksNode.setFileAction(this._module.fileAction);
		// fileLinksNode.mapActionParams(Core.Node.SourceType.PARAM_FIELD);
//O => Find	=> ObjectToElement => JoinArray=> FileLinks => AddActionLinkToEach
		var addActionLinkToListElement = new AddActionLinkToEach([joinToOneList]);
		addActionLinkToListElement.addAction(this._module.updateAction.formAction);
		addActionLinkToListElement.addAction(this._module.deleteAction.formAction);
		addActionLinkToListElement.addAction(this._module.detailAction);
//O => Find	=> ObjectToElement => JoinArray=> ileLinks => AddActionLinkToEach => SendData => X
		var sendDataNode = new Core.Node.Response.SendData([addActionLinkToListElement]);
		sendDataNode.setView("horpyna/jade/listAction");
//O => Find	=> ObjectToElement => SortLinks
		var sortNavigation = new SortLinks([joinToOneList]);
		sortNavigation.setAction(this._module.listAction);
//O => Find	=> ObjectToElement => SortLinks => SendData => X
		var orderSendDataNode = new Core.Node.Response.SendData([sortNavigation]);
		orderSendDataNode.setResponseKey("order");
//O => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([isValid]);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);
//O => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		navSendDataNode.setResponseKey("navigation");
//O => Find => pagination
		var pagination = new Pagination([listNode]);
		pagination.setAction(this._module.listAction);
		pagination.setPage(Core.Node.SourceType.RESPONSE_NODE, "page");
		pagination.setSize(Core.Node.SourceType.RESPONSE_NODE, "size");
		pagination.setAllSize(Core.Node.SourceType.RESPONSE_NODE, "allSize");
//O => Find => pagination => SendData => X
		var paginationSendData = new Core.Node.Response.SendData([pagination]);
		paginationSendData.setResponseKey("pagination");
	}
}
export = OnListResource;