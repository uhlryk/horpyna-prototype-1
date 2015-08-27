import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeMapper = require("./../NodeMapper");
import ProcessModel = require("./../ProcessModel");
/**
 * z otrzymanego źródła wyciąga jeden element i go zwraca
 * samodzielnie lub jako tablicę (jeśli rodzic przekazał mu tablicę)
 * jeśli mamy tablicę elementów prostych a kluczem jest liczba to zwróci element tablicy pod tym kluczem
 * jeśli tablica tablic a kluczem jest liczba to zwróci tablicę elementów gdzie elementy były elementami tablicy wewnętrznej o danym kluczu
 */
class ObjectToElement extends BaseNode {
	private _key: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:ObjectToElement");
	}
	public elementKey(key: string) {
		this._key = key;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			this.debug("begin");
			var entryMappedSource = this.getEntryMappedByType(processEntryList, request);
			this.debug(entryMappedSource);
			var processResponse;
			if (entryMappedSource) {
				if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY) {
					processResponse = [];
					for (var i = 0; i < entryMappedSource.length; i++) {
						processResponse.push(this.getFromObject(entryMappedSource[i]));
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					processResponse = this.getFromObject(entryMappedSource);
				} else if (this.getEntryMapType() === NodeMapper.MAP_VALUE_ARRAY) {
					processResponse = this.getFromObject(entryMappedSource);
				}
				this.debug(processResponse);
				resolve(processResponse);
			} else{
				this.debug("null");
				resolve(null);
			}
		});
	}
	/**
	 * odpowiada za wyciągnięcie pojedyńczego elementu z obiektu
	 * @param  {[type]}   dataObject   pojedyńczy obiekt
	 * @param  {any}      processEntry cała odpowiedź poprzedniego node, jest to albo pojedyńczy obiekt albo tablica
	 * @param  {Request}  request      actionRequest
	 * @param  {Response} response     actionResponse
	 * @return {Object}                [description]
	 */
	protected getFromObject(dataObject): Object {
		var responseObject = new Object();
		if (this._key) {
			responseObject = dataObject[this._key];
		}
		return responseObject;
	}
}
export = ObjectToElement;