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
				if (!model) {
				console.log("A-1");
				response.setStatus(404);
			} else {
					if (this._model.getColumnNameList().indexOf(columnQuery) === -1) {
					columnQuery = null;
				}
				if (countQuery === null) {
					countQuery = 0;
				}
				var modelData = model.toJSON();
				console.log("A0");
				response.setStatus(404);
				for(var columnName in modelData){
					console.log(columnName + "  " + columnQuery + "  " + countQuery);
					if (columnQuery === null || columnName === columnQuery){
						var column = modelData[columnName];
						console.log(column);
						if (column && column.files) {
							console.log("A1");
							var file = column.files[countQuery];
							console.log(file);
							if (file['path'] && file['originalname']) {
								console.log("A2");
								response.setStatus(200);
								response.setDownload(file['path'], file['originalname'], (err) => {
									this.onFileDownloadCb(err);
								});
							}
							break;
						}
					}
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