import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
/**
 * Akceptuje obiekt lub listę obiektów, zwraca nową listę obiektów, gdzie każdy
 * obiekt jako wartość ma unikalny klucz z otrzymanych danych a jako nowy klucz, podany na wejściu setNewKeyValue
 * np
 * {key1:val1a, key2:val1b} => [{<nowyklucz>:key1},{<nowyKlucz>:key2}]
 * a jeśli była na wejściu lista
 * [{key1:val1a, key2:val1b},{key1:val2a, key3:val2c}] => [{<nowyklucz>:key1},{<nowyKlucz>:key2}, {<nowyKlucz>:key3}]
 */
class UniqueKeyObject extends BaseNode{
	private _key: string;
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			var uniqueKeys:string[] = [];
			var entryMappedSource: Object[] = this.getEntryMappedObjectArray(processEntryList, request);
			console.log("A2");
			console.log(entryMappedSource);
			var responseObject = new Object();
			for (var i = 0; i < entryMappedSource.length; i++) {
				this.getUniqueKeys(entryMappedSource[i], uniqueKeys);
			}
			if (this._key) {
				for (var i = 0; i < uniqueKeys.length; i++){
					var key = uniqueKeys[i];
					responseObject[this._key] = key;
				}
				resolve(responseObject);
			} else {
				resolve(null);
			}

		});
	}

	protected getUniqueKeys(dataObject: Object, uniqueKeys: string[]) {
		for (var key in dataObject) {
			if(uniqueKeys.indexOf(key) === -1){
				uniqueKeys.push(key);
			}
		}
	}
	public setNewKeyValue(key: string) {
		this._key = key;
	}
}
export = UniqueKeyObject;