import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
/**
 * z otrzymanego responsa rodzica (obiektu lub tablicy obiektów) wyciąga jeden element i go zwraca
 * samodzielnie lub jako tablicę (jeśli rodzic przekazał mu tablicę)
 */
class GetObjectElement extends BaseNode {
	private _key: string;
	public elementKey(key: string) {
		this._key = key;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			var processEntry = processEntryList[0];
			processEntry = processEntry || {};
			var processResponse;
			if(processEntry){
				if (Array.isArray(processEntry)){
					processResponse = [];
					for (var i = 0; i < processEntry.length; i++){
						processResponse.push(this.getFromObject(processEntry[i], request, response));
					}
				} else {
					processResponse = this.getFromObject(processEntry, request, response);
				}
				resolve(processResponse);
			} else{
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
	protected getFromObject(dataObject, request: Request, response: Response): Object {
		var responseObject = new Object();
		if (this._key) {
			responseObject = dataObject[this._key];
		}
		return responseObject;
	}
}
export = GetObjectElement;