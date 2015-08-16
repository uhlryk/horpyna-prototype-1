import Core = require("../../../index");
/**
 * Obsługuje generowanie listy wartości z bazy danych
 * Obsługuje sortowanie i paginacje,
 */
class OnListResource extends Core.Action.ActionHandlerController {
	private _model: Core.Model;
	private _module: Core.Module;
	private _viewPath: string;
	private _fileAction: Core.Action.BaseAction;
	constructor(module: Core.Module, model: Core.Model, viewPath: string, fileAction?: Core.Action.BaseAction) {
		super();
		this._model = model;
		this._module = module;
		this._viewPath = viewPath;
		this._fileAction = fileAction;
		this.setActionHandler((request, response, action) => { return this.actionHandler(request, response, action); });
	}
	protected actionHandler(request: Core.Action.Request, response: Core.Action.Response, action: Core.Action.BaseAction): Core.Util.Promise<void> {
		var rawOrder = request.getField(Core.Action.FieldType.QUERY_FIELD, 'order');
		var page = request.getField(Core.Action.FieldType.QUERY_FIELD, 'page');
		var pageSize = request.getField(Core.Action.FieldType.QUERY_FIELD, 'size');
		var baseUri = Core.Util.Uri.updateQuery(action.getRoutePath(true), "order", rawOrder);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "page", page);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "size", pageSize);
		return Core.Util.Promise.resolve()
		.then(() => {
			var list = new Core.Query.List();
			var columnNameList = this._model.getColumnNameList();
			var order = [];
			if (rawOrder) {
				var orderList = rawOrder.split(",");
				var length = orderList.length;
				if (length > 0) {
					order = [];
					for (var i = 0; i < length; i++) {
						var elem = orderList[i].split("-");
						order.push(elem);
						elem[1] = elem[1].toUpperCase();
					}
				}
			}
			var orderLength = order.length;
			var columnLink = [];
			response.addValue("orderLink", columnLink);
			for (var i = 0; i < columnNameList.length; i++) {
				var columnName = columnNameList[i];
				var direction = "DESC";
				for (var j = 0; j < orderLength; j++) {
					var orderElement = order[j];
					if (orderElement[0] === columnName) {
						if (orderElement[1] === "DESC") {
							direction = "ASC";
						}
					}
				}
				columnLink.push({
					link: Core.Util.Uri.updateQuery(baseUri, "order", columnName + "-" + direction),
					name: columnName,
				});
			}
			list.setModel(this._model);
			var paramAppList = request.getParamAppFieldList();
			list.populateWhere(paramAppList);
			list.setOrder(order);
			return list.run();
		})
		.then((modelList) => {
			var pagination = {};
			response.addValue("pagination", pagination);
			var dataLength = modelList.length;
			if (dataLength > Core.Query.List.MAX_DATA) {
				pagination['maxHit'] = Core.Query.List.MAX_DATA;//oznacza że mamy więcej rekordów niż - Core.Query.List.MAX_DATA
			}
			if (page < 1) {
				page = 1;
			}
			if (page >= Core.Query.List.MAX_DATA) {
				page = Core.Query.List.MAX_DATA;
			}
			if (pageSize > Core.Query.List.MAX_DATA) {
				pageSize = Core.Query.List.MAX_DATA;
			}
			if (pageSize < 1) {
				pageSize = Core.Query.List.DEFAULT_PAGE_SIZE;
			}
			var maxPages = Math.ceil(dataLength / pageSize);// liczba rzeczywista stron(widok zdecyduje ile maksymalnie wyświetli)
			if (maxPages > Core.Query.List.MAX_PAGES) {
				maxPages = Core.Query.List.MAX_PAGES;
			}
			pagination['pages'] = [];
			for (var i = 0; i < maxPages; i++) {
				pagination['pages'].push({
					link: Core.Util.Uri.updateQuery(baseUri, "page", String(i + 1)),
					name: i + 1,
					active: (i === page - 1) ? true : false
				});
			}
			var maxLoop = page * pageSize;
			if (maxLoop > dataLength) {
				maxLoop = dataLength;
			}
			var responseContent = [];
			response.content = responseContent;
			for (var i = (page - 1) * pageSize; i < maxLoop; i++) {
				var model = modelList[i];
				var modelData = model.toJSON();
				/**
				 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
				 */
				var uriFileAction = "/";
				if (this._fileAction) {
					uriFileAction = this._fileAction.populateRoutePath(modelData);
				}
				for (var colName in modelData) {
					var val = modelData[colName];
					if (val && val.files) {
						for (var j in val.files) {
							var file = val.files[j];
							var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
							uri = Core.Util.Uri.updateQuery(uri, "count", j);
							file['uri'] = uri;
						}
					}
				}
				var data = {
					element: modelData,
					navigation: this.fieldActionLink(this._module, modelData)
				};
				responseContent.push(data);
			}
			response.view = this._viewPath;
		});
	}
	/**
	 * zwraca listę linków wygenerowanych z akcji które mają GET i parametry
	 * Zastosowanie gdy chcemy do wyświetlonych szczegółów danego pola dodać dodatkowe
	 * akcje typu updateform.
	 * @param  {Object}   data jest to model danego wiersza który jest w toJSON()
	 * @return {Object[]}      lista linków w strukturze [{link, name}]
	 */
	private fieldActionLink(module:Core.Module, data:Object):Object[]{
		var actionList = module.getActionList();
		var actionListLength = actionList.length;
		var links:Object[] = [];
		for (var i = 0; i < actionListLength; i++) {
			var action: Core.Action.BaseAction = actionList[i];
			if(action instanceof Core.Action.DualAction){
				action = (<Core.Action.DualAction>action).formAction;
			}
			/**
			 * Nie dodajemy akcji które wyraźnie tego nie chca
			 */
			if (action.getValue("showInNavigation") === false){
				continue;
			}
			/**
			 * Prezentujemy akcje które są dostępne przez GET
			 */
			if (action.getMethod() !== Core.Action.BaseAction.GET) {
				continue;
			}
			var actionRoute = action.populateRoutePath(data);
			/**
			 * Jeśli są akcje które nie mają PARAM_FIELD to nie są tu prezentowane
			 * ta nawigacja dotyczy danego elementu i jego parametrów
			 */
			var paramFieldList = action.getFieldListByType(Core.Action.FieldType.PARAM_FIELD);
			var paramFieldListLength = paramFieldList.length;
			if (paramFieldListLength === 0 ){
				continue;
			}
			var linkObject = {
				link: actionRoute,
				name: action.name,
			};
			links.push(linkObject);
		}
		return links;
	}
}
export = OnListResource;