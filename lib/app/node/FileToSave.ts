import Core = require("../../index");
/**
 * Generuje Linki nawigacyjne
 */
class FileToSave extends Core.Node.BaseNode {
	private _action: Core.Action.BaseAction;
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.addMapSource("action_param", Core.Action.FieldType.PARAM_FIELD);
		this.addMapSource("action_query", Core.Action.FieldType.QUERY_FIELD);
		this.initDebug("node:FileToSave");
	}
	public setAction(action: Core.Action.BaseAction) {
		this._action = action;
	}
	public setFileSource(type: string) {
		this.addMapSource("file", type);
	}
	protected content(data: Core.Node.NodeData): any {
		this.debug("begin");
		var processResponse = [];
		if (this._action) {
			var actionParam = data.getMappedObject("action_param");
			var actionQuery = data.getMappedObject("action_query");
			var fileSource = data.getMappedObjectArray("file");
			this.debug(fileSource);
			for (var j = 0; j < fileSource.length; j++) {
				var fileList = fileSource[j];
				for (var fieldName in fileList) {
					var fieldFileList = fileList[fieldName];
					if (fieldFileList) {
						var newFileList = [];
						for (var i = 0; i < fieldFileList.length; i++) {
							var singleFile = fieldFileList[i];
							delete singleFile['fieldname'];
							delete singleFile['encoding'];
							actionQuery['column'] = fieldName;
							actionQuery['count'] = i;
							singleFile['uri'] = this._action.populateRoutePathWithQuery(actionParam, actionQuery);;
							newFileList.push(singleFile);
						}
						var newObject = new Object();
						newObject[fieldName] = { files: newFileList };
						processResponse.push(newObject);
					}
				}
			}
		}
		this.debug(processResponse);
		return processResponse;
	}
}
export = FileToSave;