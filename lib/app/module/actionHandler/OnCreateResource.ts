import Core = require("../../../index");
/**
 * Akceptuje dane z formularze wysłane przez post.
 * I dodaje je do tabeli w bazie danych
 */
class OnCreateResource extends Core.Action.ActionHandlerController {
	private _model: Core.Model;
	private _targetAction: Core.Action.BaseAction;
	constructor(model: Core.Model, targetAction: Core.Action.BaseAction) {
		super();
		this._model = model;
		this._targetAction = targetAction;
		this.setActionHandler((request, response, action) => { return this.actionHandler(request, response, action); });
	}
	protected actionHandler(request: Core.Action.Request, response: Core.Action.Response, action: Core.Action.BaseAction): Core.Util.Promise<void> {
		return Core.Util.Promise.resolve()
		.then(() => {
			var create = new Core.Query.Create();
			create.setModel(this._model);
			create.populate(request.getFieldList(Core.Action.FieldType.BODY_FIELD));
			/**
			 * w danych o pliku zostawiamy tylko istotne informacje originalname, mimetype, size, destination, filename, path
			 */
			var fileList = request.getFieldList(Core.Action.FieldType.FILE_FIELD);
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
			console.log(fileList);
			create.populate(fileList);
			return create.run();
		})
		.then((model) => {
			response.content = model.toJSON();
			response.setRedirect(this._targetAction.getRoutePath());
		});
	}
}
export = OnCreateResource;