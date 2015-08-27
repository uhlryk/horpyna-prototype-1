import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
/**
 * Otrzymane źródło to tablica elementów. Z każdego elementu wyciąga określony element.
 * I zwraca tablicę wyciągniętych elementów
 * Należy pamiętać że wejście kolejnego node jest mapowane na OBJECT_ARRAY, czyli jeśli elementy będą typami prostymi to nie
 * pojawią się na wejściu następnego Node. Typy proste mogą być jednak używane jako dodatkowe źródła w innych wejściach Node'ów
 */
class ObjectToElement extends BaseNode {
	private _key: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:ObjectToElement");
	}
	public elementKey(key: string) {
		this._key = key;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			var processResponse;
			processResponse = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				processResponse.push(this.getFromObject(mappedEntry[i]));
			}
			this.debug(processResponse);
			resolve(processResponse);
		});
	}
	protected getFromObject(dataObject): Object {
		var responseObject = new Object();
		if (this._key) {
			responseObject = dataObject[this._key];
		}
		return responseObject;
	}
}
export = ObjectToElement;