import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeMapper = require("./../NodeMapper");
import ProcessModel = require("./../ProcessModel");
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
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			var response = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				var row = mappedEntry[i];
				var newRow = new Object();
				newRow[this._key] = row;
				response.push(newRow);
			}
			this.debug(response);
			resolve(response);
		});
	}
}
export = ElementToObject;