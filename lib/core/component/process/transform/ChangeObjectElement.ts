import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import NodeMapper = require("./../NodeMapper");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import ProcessModel = require("./../ProcessModel");
/**
 * Pozwala zmodyfikować pole w obiekcie lub w tablicy obiektów
 */
class ChangeObjectElement extends BaseNode {
	constructor(processModel: ProcessModel) {
		super(processModel);
		this.initDebug("node:ChangeObjectElement");
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
						processResponse.push(this.changeInObject(entryMappedSource[i], processEntryList, request, response));
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					processResponse = this.changeInObject(entryMappedSource, processEntryList, request, response);
				}
				this.debug(entryMappedSource);
				resolve(entryMappedSource);
			} else{
				this.debug("null");
				resolve(null);
			}
		});
	}
	/**
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected changeInObject(dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		var responseObject = new Object();
		for(var key in dataObject){
			var val = dataObject[key];
			if (this.checkIfKeyValueModify(key, val, dataObject, processEntryList, request, response) === true) {
				var newKey = this.modifyKey(key, val, dataObject, processEntryList, request, response);
				responseObject[newKey] = this.modifyValue(key, val, dataObject, processEntryList, request, response);
			} else if (this.checkIfKeyModify(key, val, dataObject, processEntryList, request, response) === true) {
				var newKey = this.modifyKey(key, val, dataObject, processEntryList, request, response);
				responseObject[newKey] = val;
			} else if (this.checkIfValueModify(key, val, dataObject, processEntryList, request, response) === true) {
				responseObject[key] = this.modifyValue(key, val, dataObject, processEntryList, request, response);
			} else {
				responseObject[key] = val;
			}
		}
		return responseObject;
	}
	/**
	 * Sprawdza czy dany element wymaga modyfikacji klucza i wartości
	 *
	 */
	protected checkIfKeyValueModify(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}
	/**
	 * Sprawdza czy dany element wymaga modyfikacji klucza
	 *
	 */
	protected checkIfKeyModify(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}
	/**
	 * sprawdza czy dany element wymaga modyfikacji wartości
	 */
	protected checkIfValueModify(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}
	/**
 * Modyfikuje dany klucz w elemencie obiektu
 */
	protected modifyKey(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): string {
		return key;
	}
	/**
	 * Modyfikuje daną wartość w elemencie obiektu
	 */
	protected modifyValue(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): any {
		return value;
	}
}
export = ChangeObjectElement;