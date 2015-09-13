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
		var orderQuery = new Core.Field.BaseField(this, "o", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		var directionQuery = new Core.Field.BaseField(this, "d", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		var directionFilter = new Core.Field.BaseFilter(directionQuery, "val1", false);
		directionFilter.setLogic(function(value) {
			if(value !== 'asc' && value !== 'desc'){
				value = 'asc';
			}
			return value;
		});
		var pageNumQuery = new Core.Field.BaseField(this, "p", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		new Core.Field.FilterStandard.ToInt(pageNumQuery, "intFilter");
		var pageNumFilter = new Core.Field.BaseFilter(directionQuery, "sizeFilter", false);
		pageNumFilter.setLogic(function(value) {
			if (value < 1 ) {
				value = 1;
			}
			return value;
		});
		var pageSizeQuery = new Core.Field.BaseField(this, "s", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		new Core.Field.FilterStandard.ToInt(pageSizeQuery, "intFilter");
		var pageSizeFilter = new Core.Field.BaseFilter(pageSizeQuery, "sizeFilter", false);
		pageNumFilter.setLogic(function(value) {
			if (value < 1 ) {
				value = 1;
			}
			return value;
		});
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