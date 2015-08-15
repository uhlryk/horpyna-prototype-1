import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
/**
 * Pozwala zmodyfikować pole w obiekcie lub w tablicy obiektów
 */
class ChangeObjectElement extends BaseNode {
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			var processEntry = processEntryList[0];
			var processResponse;
			if(processEntry){
				if (Array.isArray(processEntry)){
					processResponse = [];
					for (var i = 0; i < processEntry.length; i++){
						processResponse.push(this.changeInObject(processEntry[i], processEntry, request, response));
					}
				} else {
					processResponse = this.changeInObject(processEntry, processEntry, request, response);
				}
				resolve(processEntry);
			} else{
				resolve(null);
			}
		});
	}
	/**
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected changeInObject(dataObject, processEntry: any, request: Request, response: Response): Object {
		var responseObject = new Object();
		for(var key in dataObject){
			var val = dataObject[key];
			if (this.checkIfKeyValueModify(key, val, processEntry, request, response) === true) {
				var newKey = this.modifyKey(key, val, processEntry, request, response);
				responseObject[newKey] = this.modifyValue(key, val, processEntry, request, response);
			} else if (this.checkIfKeyModify(key, val, processEntry, request, response) === true) {
				var newKey = this.modifyKey(key, val, processEntry, request, response);
				responseObject[newKey] = val;
			} else if (this.checkIfValueModify(key, val, processEntry, request, response) === true) {
				responseObject[key] = this.modifyValue(key, val, processEntry, request, response);
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
	protected checkIfKeyValueModify(key: string, value: any, processEntry: any, request: Request, response: Response): boolean {
		return false;
	}
	/**
	 * Sprawdza czy dany element wymaga modyfikacji klucza
	 *
	 */
	protected checkIfKeyModify(key: string, value: any, processEntry: any, request: Request, response: Response): boolean {
		return false;
	}
	/**
	 * sprawdza czy dany element wymaga modyfikacji wartości
	 */
	protected checkIfValueModify(key: string, value: any, processEntry: any, request: Request, response: Response): boolean {
		return false;
	}
	/**
 * Modyfikuje dany klucz w elemencie obiektu
 */
	protected modifyKey(key: string, value: any, processEntry: any, request: Request, response: Response): string {
		return key;
	}
	/**
	 * Modyfikuje daną wartość w elemencie obiektu
	 */
	protected modifyValue(key: string, value: any, processEntry: any, request: Request, response: Response): any {
		return value;
	}
}
export = ChangeObjectElement;