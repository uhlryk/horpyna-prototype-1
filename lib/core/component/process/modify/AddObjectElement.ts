import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
/**
 * Pozwala dodać pole w obiekcie lub w każdym z obiektów tablicy
 */
class AddObjectElement extends BaseNode {
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			var processEntry = processEntryList[0];
			processEntry = processEntry || {};
			var processResponse;
			if(processEntry){
				if (Array.isArray(processEntry)){
					processResponse = [];
					for (var i = 0; i < processEntry.length; i++){
						processResponse.push(this.addInObject(processEntry[i], processEntry, request, response));
					}
				} else {
					processResponse = this.addInObject(processEntry, processEntry, request, response);
				}
				resolve(processResponse);
			} else{
				resolve(null);
			}
		});
	}
	/**
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected addInObject(dataObject, processEntry: any, request: Request, response: Response): Object {
		var responseObject = new Object();
		if (this.checkIfAddBeforeAll(processEntry, request, response)) {
			this.mergeObjects(responseObject, this.addBeforeAll(processEntry, request, response));
		}
		for(var key in dataObject){
			var val = dataObject[key];
			if (this.checkIfAddBeforeElement(key, val, processEntry, request, response) === true) {
				this.mergeObjects(responseObject, this.addBeforeElement(key, val, processEntry, request, response));
			}
			responseObject[key] = val;
			if (this.checkIfAddAfterElement(key, val, processEntry, request, response) === true) {
				this.mergeObjects(responseObject, this.addAfterElement(key, val, processEntry, request, response));
			}
		}
		if (this.checkIfAddAfterAll(processEntry, request, response)) {
			this.mergeObjects(responseObject, this.addAfterAll(processEntry, request, response));
		}
		return responseObject;
	}
	protected mergeObjects(responseObject: Object, modifyObject:Object) {
		for(var key in modifyObject){
			var value = modifyObject[key];
			responseObject[key] = value;
		}
	}
	protected checkIfAddBeforeAll(processEntry: any, request: Request, response: Response): boolean {
		return false;
	}
	protected checkIfAddBeforeElement(key: string, value: any, processEntry: any, request: Request, response: Response): boolean {
		return false;
	}
	protected checkIfAddAfterElement(key: string, value: any, processEntry: any, request: Request, response: Response): boolean {
		return false;
	}
	protected checkIfAddAfterAll(processEntry: any, request: Request, response: Response): boolean {
		return false;
	}


	protected addBeforeAll(processEntry: any, request: Request, response: Response): Object {
		return {};
	}
	protected addBeforeElement(key: string, value: any, processEntry: any, request: Request, response: Response): Object {
		return {};
	}
	protected addAfterElement(key: string, value: any, processEntry: any, request: Request, response: Response): Object {
		return {};
	}
	protected addAfterAll(processEntry: any, request: Request, response: Response): Object {
		return {};
	}
}
export = AddObjectElement;