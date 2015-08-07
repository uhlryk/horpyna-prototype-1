import Core = require("../../../index");
/**
 * Obsługuje formularz usunięcia pola. Formularz zawiera wypełnione pola danymi które będą usunięte. Pola te są readonly
 * ponieważ tylko chcemy pokazać pola jakie są do usunięcia
 */
class OnFormDeleteResource extends Core.Action.ActionHandlerController {
	private _model: Core.Model;
	/**
	 * Jeśli nie znajdzie danych do update to przekieruje na tą akcję
	 */
	private _onEmptyAction: Core.Action.BaseAction;
	private _fileAction: Core.Action.BaseAction;
	private _viewPath: string;
	constructor(model: Core.Model, viewPath: string, onEmptyAction: Core.Action.BaseAction, fileAction?: Core.Action.BaseAction) {
		super();
		this._model = model;
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
				model = model.toJSON();
				var content = response.content;
				var form: Core.Action.IForm = content["form"];
				var fieldList: Core.Action.IInputForm[] = form.fields;
				for (var i = 0; i < fieldList.length; i++) {
					var field: Core.Action.IInputForm = fieldList[i];
					var name = field.name;
					var value = model[name];
					if (value) {
						field.value = value;
					}
				}
				/**
				 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
				 */
				var uriFileAction = "/";
				if (this._fileAction) {
					uriFileAction = this._fileAction.populateRoutePath(model);
				}
				for (var colName in model) {
					var val = model[colName];
					if (val && val.files) {
						for (var j in val.files) {
							var file = val.files[j];
							var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
							uri = Core.Util.Uri.updateQuery(uri, "count", j);
							file['uri'] = uri;
						}
					}
				}
			}
			response.view = this._viewPath;
		});
	}
}
export = OnFormDeleteResource;