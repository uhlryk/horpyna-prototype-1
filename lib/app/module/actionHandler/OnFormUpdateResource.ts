import Core = require("../../../index");
/**
 * Obsługuje wyświetlanie formularza do edycji danych. Przy wejściu na formularz wypełnia go danymi aktualnymi,
 * po zmianie wysyła to do odpowiedniej akcji, jeśli wystąpią błędy to formularz wyświetli błędy
 */
class OnFormUpdateResource extends Core.Action.ActionHandlerController {
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
				var form: Core.Form.IForm = content["form"];
				var fieldList: Core.Form.IInputForm[] = form.fields;
				var validationResponse: Core.Action.ValidationResponse = <Core.Action.ValidationResponse>response.getData("validationError");
				if (validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
					form.valid = false;
					for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
						var validatorResponse: Core.Validator.ValidatorResponse = validationResponse.responseValidatorList[i];
						for (var j = 0; j < fieldList.length; j++) {
							var field: Core.Form.IInputForm = fieldList[j];
							if (field.name === validatorResponse.field) {
								field.value = validatorResponse.value;
								field.valid = validatorResponse.valid;
								if (validatorResponse.valid === false) {
									field.errorList = field.errorList.concat(validatorResponse.errorList);
								}
							}
						}
					}
				} else {
					for (var i = 0; i < fieldList.length; i++) {
						var field: Core.Form.IInputForm = fieldList[i];
						var name = field.name;
						var value = model[name];
						if (value) {
							field.value = value;
						}
					}
				}
				/**
				 * HACK
				 * hack biorący listę pól plików a następnie sprawdzający czy są dla tych plików checkboxy do usunięcia pliku
				 * jeśli tak to wypełnia je właściwymi danymi
				 */
				var fileFieldList: string[] = [];
				for (var i = 0; i < fieldList.length; i++) {
					var field: Core.Form.IInputForm = fieldList[i];
					if (field.type === Core.Action.FormInputType.FILE) {
						fileFieldList.push(field.name);
					}
				}
				for (var i = 0; i < fieldList.length; i++) {
					var field: Core.Form.IInputForm = fieldList[i];
					if (field.type === Core.Action.FormInputType.CHECKBOX && fileFieldList.indexOf(field.name) !== -1) {
						field.value = "1";
						field.label = "Delete file";
					}
				}
				//KONIEC HACKA
				/**
				 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
				 */
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
						for (var z in val.files) {
							var file = val.files[z];
							var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
							uri = Core.Util.Uri.updateQuery(uri, "count", z);
							file['uri'] = uri;
						}
					}
				}
			}
			response.view = this._viewPath;
		});
	}
}
export = OnFormUpdateResource;