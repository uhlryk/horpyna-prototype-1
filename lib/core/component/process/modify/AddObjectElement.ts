import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeMapper = require("./../NodeMapper");
import ProcessModel = require("./../ProcessModel");
/**
 * Pozwala dodać pole w obiekcie lub w każdym z obiektów tablicy
 */
class AddObjectElement extends BaseNode {
	constructor(processModel: ProcessModel) {
		super(processModel);
		this.initDebug("node:AddObjectElement");
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
						processResponse.push(this.addInObject(entryMappedSource, processEntryList, request, response));
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					processResponse = this.addInObject(entryMappedSource, processEntryList, request, response);
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
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected addInObject(dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		var responseObject = new Object();
		if (this.checkIfAddBeforeAll(dataObject, processEntryList, request, response)) {
			this.mergeObjects(responseObject, this.addBeforeAll(dataObject, processEntryList, request, response));
		}
		for(var key in dataObject){
			var val = dataObject[key];
			if (this.checkIfAddBeforeElement(key, val, dataObject, processEntryList, request, response) === true) {
				this.mergeObjects(responseObject, this.addBeforeElement(key, val, dataObject, processEntryList, request, response));
			}
			responseObject[key] = val;
			if (this.checkIfAddAfterElement(key, val, dataObject, processEntryList, request, response) === true) {
				this.mergeObjects(responseObject, this.addAfterElement(key, val, dataObject, processEntryList, request, response));
			}
		}
		if (this.checkIfAddAfterAll(dataObject, processEntryList, request, response)) {
			this.mergeObjects(responseObject, this.addAfterAll(dataObject, processEntryList, request, response));
		}
		return responseObject;
	}
	protected mergeObjects(responseObject: Object, modifyObject:Object) {
		for(var key in modifyObject){
			var value = modifyObject[key];
			responseObject[key] = value;
		}
	}
	protected checkIfAddBeforeAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}
	protected checkIfAddBeforeElement(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}
	protected checkIfAddAfterElement(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}
	protected checkIfAddAfterAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return false;
	}


	protected addBeforeAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		return {};
	}
	protected addBeforeElement(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		return {};
	}
	protected addAfterElement(key: string, value: any, dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		return {};
	}
	protected addAfterAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		return {};
	}
}
export = AddObjectElement;