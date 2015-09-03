import ChangeObjectElement = require("./ChangeObjectElement");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Util = require("./../../../util/Util");
import NodeData = require("./../NodeData");
/**
 * zwraca listę kluczy unikalnych;
 * @Deprecated nie używać tego bo jest niepotrzebne a może mieć błędy
 */
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
	protected checkIfValueModify(key: string, value: any, objectToModify: Object, data: NodeData): boolean {
		if (value && value.files) {
			return true;
		}
		return false;
	}
	protected modifyValue(key: string, value: any, objectToModify: Object, data: NodeData): any {
		var uriFileAction = "/";
		if (this._action) {
			var params = data.getMappedObject("params");
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