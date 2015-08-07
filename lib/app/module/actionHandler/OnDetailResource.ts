import Core = require("../../../index");
/**
 * Wyświetla szczególy danego pola
 */
class OnDetailResource extends Core.Action.ActionHandlerController {
	private _viewPath: string;
	private _model: Core.Model;
	private _module: Core.Module;
	private _onEmptyAction: Core.Action.BaseAction;
	private _fileAction: Core.Action.BaseAction;
	constructor(module: Core.Module, model: Core.Model, viewPath: string, onEmptyAction: Core.Action.BaseAction, fileAction?: Core.Action.BaseAction) {
		super();
		this._model = model;
		this._module = module;
		this._onEmptyAction = onEmptyAction;
		this._fileAction = fileAction;
		this._viewPath = viewPath;
		this.setActionHandler((request, response, action) => { return this.actionHandler(request, response, action); });
	}
	protected actionHandler(request: Core.Action.Request, response: Core.Action.Response, action: Core.Action.BaseAction): Core.Util.Promise<void> {
		return Core.Util.Promise.resolve()
		.then(() => {
			var find = new Core.Query.Find();
			find.setModel(this._model);
			var paramAppList = request.getParamAppFieldList();
			find.populateWhere(paramAppList);
			return find.run();
		})
		.then((model) => {
			if (!model) {
				response.setRedirect(this._onEmptyAction.getRoutePath());
			} else {
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
				response.content = data;
			}
			response.view = "horpyna/jade/detailAction";
		});
	}
	/**
	 * zwraca listę linków wygenerowanych z akcji które mają GET i parametry
	 * Zastosowanie gdy chcemy do wyświetlonych szczegółów danego pola dodać dodatkowe
	 * akcje typu updateform.
	 * @param  {Object}   data jest to model danego wiersza który jest w toJSON()
	 * @return {Object[]}      lista linków w strukturze [{link, name}]
	 */
	private fieldActionLink(module: Core.Module, data: Object): Object[] {
		var actionList = module.getActionList();
		var actionListLength = actionList.length;
		var links:Object[] = [];
		for (var i = 0; i < actionListLength; i++) {
			var action: Core.Action.BaseAction = actionList[i];
			if(action instanceof Core.Action.DualAction){
				action = (<Core.Action.DualAction>action).formAction;
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
export = OnDetailResource;