import Util = require("./../../../util/Util");
import BaseNode = require("./../BaseNode");
import NodeData = require("./../NodeData");
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
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
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
		return processResponse;
	}
}
export = JoinArray;