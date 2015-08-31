import Util = require("./../../../util/Util");
import BaseNode = require("./../BaseNode");
import NodeData = require("./../NodeData");
/**
 * Źródłem będzie tablica to wynikiem będzie tablica obiektów mająca klucz o podanej nazwie i jako wartość
 * oryginalne elementy tablicy
 * [cos,jest,tu] => [{klucz:cos},{klucz:jest},{klucz:tu}]
 */
class ElementToObject extends BaseNode {
	private _key: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:ElementToObject");
		this._key = "0";
	}
	/**
	 * wskazujemy klucz jaki ma mieć nowy obiekt
	 */
	public setKey(v: string) {
		this._key = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
		this.debug(mappedEntry);
		var response = [];
		for (var i = 0; i < mappedEntry.length; i++) {
			var row = mappedEntry[i];
			var newRow = new Object();
			newRow[this._key] = row;
			response.push(newRow);
		}
		this.debug(response);
		return response;
	}
}
export = ElementToObject;