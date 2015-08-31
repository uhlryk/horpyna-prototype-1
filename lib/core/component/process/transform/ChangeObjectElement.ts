import Util = require("./../../../util/Util");
import BaseNode = require("./../BaseNode");
import NodeData = require("./../NodeData");
/**
 * Pozwala zmodyfikować pole w obiekcie lub w tablicy obiektów
 */
class ChangeObjectElement extends BaseNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:ChangeObjectElement");
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
		this.debug(mappedEntry);
		var processResponse = [];
		for (var i = 0; i < mappedEntry.length; i++) {
			processResponse.push(this.changeInObject(mappedEntry[i], data));
		}
		this.debug(mappedEntry);
		return mappedEntry;
	}
	/**
	 * Node akceptuje listę obiektów lub obiekt, poniższa metoda obsługuje pojedyńćzy obiekt
	 */
	protected changeInObject(objectToModify: Object, data: NodeData): Object {
		var responseObject = new Object();
		for(var key in objectToModify){
			var val = objectToModify[key];
			if (this.checkIfKeyValueModify(key, val, objectToModify, data) === true) {
				var newKey = this.modifyKey(key, val, objectToModify, data);
				responseObject[newKey] = this.modifyValue(key, val, objectToModify, data);
			} else if (this.checkIfKeyModify(key, val, objectToModify, data) === true) {
				var newKey = this.modifyKey(key, val, objectToModify, data);
				responseObject[newKey] = val;
			} else if (this.checkIfValueModify(key, val, objectToModify, data) === true) {
				responseObject[key] = this.modifyValue(key, val, objectToModify, data);
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
	protected checkIfKeyValueModify(key: string, value: any, objectToModify: Object, data: NodeData): boolean {
		return false;
	}
	/**
	 * Sprawdza czy dany element wymaga modyfikacji klucza
	 *
	 */
	protected checkIfKeyModify(key: string, value: any, objectToModify: Object, data: NodeData): boolean {
		return false;
	}
	/**
	 * sprawdza czy dany element wymaga modyfikacji wartości
	 */
	protected checkIfValueModify(key: string, value: any, objectToModify: Object, data: NodeData): boolean {
		return false;
	}
	/**
 * Modyfikuje dany klucz w elemencie obiektu
 */
	protected modifyKey(key: string, value: any, objectToModify: Object, data: NodeData): string {
		return key;
	}
	/**
	 * Modyfikuje daną wartość w elemencie obiektu
	 */
	protected modifyValue(key: string, value: any, objectToModify: Object, data: NodeData): any {
		return value;
	}
}
export = ChangeObjectElement;