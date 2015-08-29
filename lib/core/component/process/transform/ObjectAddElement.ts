import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeMapper = require("./../NodeMapper");
import ProcessModel = require("./../ProcessModel");
/**
 * Pozwala dodać pole w każdym z obiektów tablicy
 * Pole może być dodane na początku tablicy lub na końcu - jeśli dodane będzie pole numeryczne to pojawi się zawsze na początku
 */
class ObjectAddElement extends BaseNode {
	private _keyValue: Object;
	private _keyValueMapType: string[];
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this._keyValue = new Object();
		this._keyValueMapType = Object();
		this.initDebug("node:ObjectAddElement");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			var processResponse;
			processResponse = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				processResponse.push(this.addElementToObject(mappedEntry[i], processEntryList, request));
			}
			this.debug(processResponse);
			resolve(processResponse);
		});
	}
	/**
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected addElementToObject(dataObject: Object, processEntryList: any[], request: Request): Object {
		this.mergeObjects(dataObject, this._keyValue);
		for (var key in this._keyValueMapType) {
			var type = this._keyValueMapType[key];
			var afterObj = new Object();
			afterObj[key] = this.getMappedSource("add_" + key, type, processEntryList, request);
			this.mergeObjects(dataObject, afterObj);
		}
		return dataObject;
	}
	protected mergeObjects(dataObject: Object, modifyObject: Object) {
		for(var key in modifyObject){
			var value = modifyObject[key];
			dataObject[key] = value;
		}
	}
	public setKeyValue(key:string, value:any){
		this._keyValue[key] = value;
	}
	public setKeyValueMapObjectArray(key: string, mapList: { sourceType: string; sourceKey?: string[] }[]) {
		this.setKeyValueMap(key, mapList, NodeMapper.MAP_OBJECT_ARRAY);
	}
	public setKeyValueMapObject(key: string, mapList: { sourceType: string; sourceKey?: string[] }[]) {
		this.setKeyValueMap(key, mapList, NodeMapper.MAP_OBJECT);
	}
	public setKeyValueMapValueArray(key: string, mapList: { sourceType: string; sourceKey?: string[] }[]) {
		this.setKeyValueMap(key, mapList, NodeMapper.MAP_VALUE_ARRAY);
	}
	public setKeyValueMapValue(key: string, mapList: { sourceType: string; sourceKey?: string[] }[]) {
		this.setKeyValueMap(key, mapList, NodeMapper.MAP_VALUE);
	}
	protected setKeyValueMap(key: string, mapList: { sourceType: string; sourceKey?: string[] }[],mapType:string) {
		this._keyValueMapType[key] = mapType;
		for (var i = 0; i < mapList.length; i++) {
			this.addMapSource("add_" + key, mapList[i].sourceType, mapList[i].sourceKey);
		}
	}
}
export = ObjectAddElement;