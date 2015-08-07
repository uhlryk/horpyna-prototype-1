import Core = require("../../../index");
/**
 * Obsługuje wyświetlanie plików które są dodatkowo zabezpieczone, sprawdzane mogą być uprawnienia
 * generalnie ścieżka do pliku nie jest ścieżką publiczną. Klasa gdy jest wywołana wyszukuje plik
 * i wyświetla jego strumień
 */
class OnFileResource extends Core.Action.ActionHandlerController {
	private _model: Core.Model;
	constructor(model: Core.Model) {
		super();
		this._model = model;
		this.setActionHandler((request, response, action) => { return this.actionHandler(request, response, action); });
	}
	protected actionHandler(request: Core.Action.Request, response: Core.Action.Response, action: Core.Action.BaseAction): Core.Util.Promise<void> {
		var columnQuery = request.getField(Core.Action.FieldType.QUERY_FIELD, "column");
		var countQuery = request.getField(Core.Action.FieldType.QUERY_FIELD, "count");
		return Core.Util.Promise.resolve()
		.then(() => {
			var find = new Core.Query.Find();
			find.setModel(this._model);
			var paramAppList = request.getParamAppFieldList();
			find.populateWhere(paramAppList);
			return find.run();
		})
		.then((model) => {
				if (!model || this._model.getColumnNameList().indexOf(columnQuery) === -1) {
				response.setStatus(404);
			} else {
				var modelData = model.toJSON();
				var column = modelData[columnQuery];
				if (column && column.files && column.files[countQuery]) {
					var file = column.files[countQuery];
					if (file['path'] && file['originalname']) {
						response.setDownload(file['path'], file['originalname'], (err) => {
							this.onFileDownloadCb(err);
						});
					} else {
						response.setStatus(404);
					}
				} else {
					response.setStatus(404);
				}
			}
		});
	}
	/**
	 * Callback wywoływany gdy plik zostanie wysłany do przeglądarki
	 */
	public onFileDownloadCb(err){
		if (err) {
			this.debug("failure download file");
		// Handle error, but keep in mind the response may be partially-sent
		// so check res.headersSent
		} else {
			this.debug("success download file");
		// decrement a download credit, etc.
		}
	}
}
export = OnFileResource;