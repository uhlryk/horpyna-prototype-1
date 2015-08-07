import Core = require("../../../index");
/**
 * Akceptuje dane z POST i id danego wpisu w bazie. Pozwala dokonać zmiany w tym wpisie
 */
class OnUpdateResource extends Core.Action.ActionHandlerController {
	private _model: Core.Model;
	private _targetAction: Core.Action.BaseAction;
	private _onEmptyAction: Core.Action.BaseAction;
	constructor(model: Core.Model, targetAction: Core.Action.BaseAction, onEmptyAction: Core.Action.BaseAction) {
		super();
		this._model = model;
		this._targetAction = targetAction;
		this._onEmptyAction = onEmptyAction;
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
				var oldModelData = model.toJSON();

				var update = new Core.Query.Update();
				update.setModel(this._model);
				var paramAppList = request.getParamAppFieldList();
				update.populateWhere(paramAppList);

				var bodyList = request.getFieldList(Core.Action.FieldType.BODY_FIELD);
				var fileList = request.getFieldList(Core.Action.FieldType.FILE_FIELD);
				/**
				 * mechanizm pozwala usuwać pliki które w edycji nie zostały dodane a dla których pole jest opcjonalne
				 */
				for (var fieldName in fileList) {
					var fieldValue = fileList[fieldName];
					//wartość jest pusta, a więc przy edycji nie została wysłana
					if (!fieldValue) {
						//sprawdzamy czy w formularzu zostało wysłane polecenie usunięcie pliku jeśli był wcześniej dodany
						var valueDeleteFile = bodyList[fieldName];
						var field: Core.Field = action.getField(Core.Action.FieldType.BODY_FIELD, fieldName);
						//jeśli valueDeleteFile = "1" to znaczy że jest polecenie usunięcia pliku
						//sprawdzamy czy pole jest opcjonalne - czyli czy może być puste przez jego usunięcie
						if (valueDeleteFile === "1" && field.optional === true) {
							//domyślnie mechanizm zastąpi plik w bazie polem null, nie musimy nic robić - potem usunąć tylko stary plik
							this.removeOldFiles(oldModelData[fieldName]);
						} else {
							//stary plik musi zostać, usuwamy wpis o tym że dany plik w bazie ma być zastąpiony nullem
							delete fileList[fieldName];
							delete bodyList[fieldName];
						}
					} else {
						this.removeOldFiles(oldModelData[fieldName]);
					}
				}
				update.populate(bodyList);
				/**
				 * w danych o pliku zostawiamy tylko istotne informacje originalname, mimetype, size, destination, filename, path
				 */
				for (var fieldName in fileList) {
					var fieldFileList = fileList[fieldName];
					if (fieldFileList) {
						for (var i = 0; i < fieldFileList.length; i++) {
							var singleFile = fieldFileList[i];
							delete singleFile['fieldname'];
							delete singleFile['encoding'];
						}
						fileList[fieldName] = { files: fieldFileList }
					}
				}
				update.populate(fileList);
				return update.run();
			}
		})
		.then(() => {
			response.setRedirect(this._targetAction.getRoutePath());
		});
	}
	protected removeOldFiles(fileDbObjects: {files:{path: string}[]}){
		if (fileDbObjects && fileDbObjects.files) {
			for (var i = 0; i < fileDbObjects.files.length; i++){
				var file = fileDbObjects.files[i];
				this.debug("rm file " + file.path);
				Core.Util.FS.unlinkSync(file.path)
			}
		}
	}
}
export = OnUpdateResource;