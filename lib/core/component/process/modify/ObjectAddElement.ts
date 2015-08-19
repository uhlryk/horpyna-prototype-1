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
class ObjectAddElement extends BaseNode {
	private _keyValueBefore: Object;
	private _keyValueMapBefore: string[];
	private _keyValueAfter: Object;
	private _keyValueMapAfter: string[];
	constructor(processModel: ProcessModel) {
		super(processModel);
		this._keyValueBefore = new Object();
		this._keyValueAfter = new Object();
		this._keyValueMapAfter = Object();
		this._keyValueMapBefore = Object();
		this.initDebug("node:ObjectAddElement");
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
						processResponse.push(this.addElementToObject(entryMappedSource, processEntryList, request));
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					processResponse = this.addElementToObject(entryMappedSource, processEntryList, request);
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
	protected addElementToObject(dataObject: Object, processEntryList: any[], request: Request): Object {
		var responseObject = new Object();
		this.mergeObjects(responseObject, this._keyValueBefore);
		for (var key in this._keyValueMapBefore) {
			var type = this._keyValueMapBefore[key];
			var beforeObj = new Object();
			beforeObj[key] = this.getMappedSource("before_" + key, type, processEntryList, request);
			this.mergeObjects(responseObject, beforeObj);
		}
		this.mergeObjects(responseObject, this._keyValueAfter);
		for (var key in this._keyValueMapAfter) {
			var type = this._keyValueMapAfter[key];
			var afterObj = new Object();
			afterObj[key] = this.getMappedSource("after_" + key, type, processEntryList, request);
			this.mergeObjects(responseObject, afterObj);
		}
		return responseObject;
	}
	protected mergeObjects(responseObject: Object, modifyObject:Object) {
		for(var key in modifyObject){
			var value = modifyObject[key];
			responseObject[key] = value;
		}
	}
	public addKeyValueBefore(key:string, value:any){
		this._keyValueBefore[key] = value;
	}
	public addKeyValueAfter(key:string, value:any){
		this._keyValueAfter[key] = value;
	}
	public addKeyValueMapBefore(key: string, mapList: { type: string; key?: string[] }[], mapType?: string) {
		this._keyValueMapBefore[key] = mapType || NodeMapper.MAP_OBJECT;
		for (var i = 0; i < mapList.length; i++) {
			this.addMapSource("before_" + key, mapList[i].type, mapList[i].key);
		}
	}
	public addKeyValueMapAfter(key: string, mapList: { type: string; key?: string[] }[], mapType?: string) {
		this._keyValueMapAfter[key] = mapType || NodeMapper.MAP_OBJECT;
		for (var i = 0; i < mapList.length; i++) {
			this.addMapSource("after_" + key, mapList[i].type, mapList[i].key);
		}
	}
}
export = ObjectAddElement;