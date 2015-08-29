import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
/**
 * Jeśli wejściowa lista(A) ma tablice(B) które mają obiekty lub tablice. To możemy uprościć strukturę łącząc wszystkie tablice(B) z listy
 * i zawartiść wrzucając bezpośrednio do listy.
 * Taka sytuacja może pojawić się jak mamy listę obiektów który ma jakiś element będący listą i za pomocą ObjectToElement wyciągniemy tą listę
 * Jak działa:
 * [[{A},{B},{C}],[{D},{E}]] => [{A},{B},{C},{D},{E}]
 *
 * jeśli lista oprócz tablic zawierała obiekty to zostaną one usunięte
 */
class JoinArray extends BaseNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:JoinArray");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			var processResponse;
			processResponse = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				if (Util._.isArray(mappedEntry[i])){
					var elem = mappedEntry[i];
					for (var j = 0; j < elem['length']; j++) {
						processResponse.push(elem[j]);
					}
				}
			}
			this.debug(processResponse);
			resolve(processResponse);
		});
	}
}
export = JoinArray;