import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeMapper = require("./../NodeMapper");
import ProcessModel = require("./../ProcessModel");
/**
 * dane które otrzyma wrzuca w obiekt o parametrze takim jaki dostanie
 * Jeśli źródłem będzie tablica to wynikiem będzie tablica obiektów mająca klucz o podanej nazwie i jako wartość
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
			var entryMappedSource = this.getEntryMappedByType(processEntryList, request);
			this.debug(entryMappedSource);
			var response;
			if (entryMappedSource) {
				if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY) {
					response = [];
					for (var i = 0; i < entryMappedSource.length; i++) {
						var row = entryMappedSource[i];
						var newRow = new Object();
						newRow[this._key] = row;
						response.push(newRow);
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					response = new Object();
					response[this._key] = entryMappedSource;
				} else if (this.getEntryMapType() === NodeMapper.MAP_VALUE_ARRAY) {
					response = [];
					for (var i = 0; i < entryMappedSource.length; i++) {
						var val = entryMappedSource[i];
						var newRow = new Object();
						newRow[this._key] = val;
						response.push(newRow);
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_VALUE) {
					response = new Object();
					response[this._key] = entryMappedSource;
				}
			}
			this.debug(response);
			resolve(response);
		});
	}
}
export = ElementToObject;