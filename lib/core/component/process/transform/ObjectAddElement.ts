import Util = require("./../../../util/Util");
import BaseNode = require("./../BaseNode");
import NodeMapper = require("./../NodeMapper");
import NodeData = require("./../NodeData");
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
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
		this.debug(mappedEntry);
		var processResponse = [];
		for (var i = 0; i < mappedEntry.length; i++) {
			processResponse.push(this.addElementToObject(mappedEntry[i], data));
		}
		this.debug(processResponse);
		return processResponse;
	}
	/**
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected addElementToObject(objectToModify: Object, data: NodeData): Object {
		this.mergeObjects(objectToModify, this._keyValue);
		for (var key in this._keyValueMapType) {
			var type = this._keyValueMapType[key];
			var afterObj = new Object();
			afterObj[key] = data.getMappedSource("add_" + key, type);
			this.mergeObjects(objectToModify, afterObj);
		}
		return objectToModify;
	}
	protected mergeObjects(objectToModify: Object, objectForMerge: Object) {
		for (var key in objectForMerge) {
			var value = objectForMerge[key];
			objectToModify[key] = value;
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