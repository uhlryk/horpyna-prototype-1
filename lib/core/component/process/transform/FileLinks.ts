import ChangeObjectElement = require("./ChangeObjectElement");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
class FileLinks extends ChangeObjectElement{
	private _action: BaseAction;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:FileLinks");
	}
	/**
	 * wskazujemy akcję która obsługuje dane pliki
	 * @param {BaseAction} v [description]
	 */
	public setFileAction(v: BaseAction) {
		this._action = v;
	}
	/**
	 * Jeśli akcja ma parametry to wskazujemy z jakiego źródła ma stworzyć obiekt do populate params
	 */
	public mapActionParams(type: string, key?: string[]) {
		this.addMapSource("params", type, key);
	}
	protected checkIfValueModify(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		if (value && value.files) {
			return true;
		}
		return false;
	}
	protected modifyValue(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): any {
		var uriFileAction = "/";
		if (this._action) {
			var params = this.getMappedObject("params", processEntryList, request);
			if (params) {
				uriFileAction = this._action.populateRoutePath(params);
			} else {
				uriFileAction = this._action.getRoutePath(false);
			}
		}
		for (var i in value.files) {
			var file = value.files[i];
			var uri = Util.Uri.updateQuery(uriFileAction, "column", key);
			uri = Util.Uri.updateQuery(uri, "count", i);
			file['uri'] = uri;

		}
		return value;
	}
}
export = FileLinks;