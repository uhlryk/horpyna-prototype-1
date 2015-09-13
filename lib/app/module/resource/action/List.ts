import Core = require("../../../../index");
/**
 * Obsługuje generowanie listy wartości z bazy danych
 * Obsługuje sortowanie i paginacje,
 */
class List extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name: string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
		//order
		new Core.Field.BaseField(this, "o", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		//direction asc | desc
		new Core.Field.BaseField(this, "d", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		//page num
		new Core.Field.BaseField(this, "p", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		//page size
		new Core.Field.BaseField(this, "s", Core.Field.FieldType.QUERY_FIELD, { optional: true });
	}
	public configProcessModel() {
		var processModel = new Core.Node.ProcessModel();
		this.setActionHandler(processModel.getActionHandler());

		var isValid = new Core.Node.Request.IsValid([processModel]);

		var listNode = new Core.Node.Db.List([isValid]);
		listNode.setModel(this._module.model);
		listNode.addWhere(Core.Node.SourceType.PARAM_FIELD);
		listNode.addWhere(Core.Node.SourceType.APP_FIELD);
		listNode.setOrder(Core.Node.SourceType.QUERY_FIELD, "o");
		listNode.setDirection(Core.Node.SourceType.QUERY_FIELD, "d");
		listNode.setPage(Core.Node.SourceType.QUERY_FIELD, "p");
		listNode.setSize(Core.Node.SourceType.QUERY_FIELD, "s");

		var objectElementNode = new Core.Node.Transform.ObjectToElement([listNode]);
		objectElementNode.elementKey("list");

		var joinToOneList = new Core.Node.Transform.JoinArray([objectElementNode]);

		var addActionLinkToListElement = new Core.App.Node.AddActionLinkToEach([joinToOneList]);
		addActionLinkToListElement.addAction(this._module.updateFormAction);
		addActionLinkToListElement.addAction(this._module.deleteFormAction);
		addActionLinkToListElement.addAction(this._module.detailAction);

		var sendDataNode = new Core.Node.Response.SendData([addActionLinkToListElement]);
		sendDataNode.setView("horpyna/jade/listAction");

		var sortNavigation = new Core.App.Node.SortLinks([joinToOneList]);
		sortNavigation.setAction(this._module.listAction);

		var orderSendDataNode = new Core.Node.Response.SendData([sortNavigation]);
		orderSendDataNode.setResponseKey("order");

		var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([isValid]);
		addSecondaryActionLinksNode.addAction(this._module.createFormAction);

		var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		navSendDataNode.setResponseKey("navigation");

		var pagination = new Core.App.Node.Pagination([listNode]);
		pagination.setAction(this._module.listAction);
		pagination.setPage(Core.Node.SourceType.RESPONSE_NODE, "page");
		pagination.setSize(Core.Node.SourceType.RESPONSE_NODE, "size");
		pagination.setAllSize(Core.Node.SourceType.RESPONSE_NODE, "allSize");

		var paginationSendData = new Core.Node.Response.SendData([pagination]);
		paginationSendData.setResponseKey("pagination");
	}
}
export = List;