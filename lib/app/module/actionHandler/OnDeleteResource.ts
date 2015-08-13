import Core = require("../../../index");
/**
 * Akceptuje dane z POST i id danego wpisu w bazie. Pozwala dokonać zmiany w tym wpisie
 */
class OnDeleteResource extends Core.Action.ActionHandlerController {
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
				for(var colName in oldModelData){
					var colValue = oldModelData[colName];
					if(colValue && colValue.files){
						this.removeOldFiles(colValue);
					}
				}
				var deleteQuery = new Core.Query.Delete();
				deleteQuery.setModel(this._model);
				var paramAppList = request.getParamAppFieldList();
				deleteQuery.populateWhere(paramAppList);
				return deleteQuery.run();
			}
		})
		.then(()=>{
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
export = OnDeleteResource;