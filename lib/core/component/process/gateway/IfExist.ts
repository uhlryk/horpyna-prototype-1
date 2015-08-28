import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
/**
 * Jeśli strumień wejściowy nie ma danych to output connection block
 * lub jeśli negation jest włączone to jeśli są dane wejściowe to output connection block
 * Jako brak danych wejściowych rozumiemy pustą tablicę
 * Jeśli tablica ma puste obiekty to i tak oznacza to że mamy dane wejściowe
 * Jeśli dane wejściowe mają typy proste, a my mapujemy je przez OBJECT_ARRAY to zostaną one pominięte a więc dane wejściowe będą puste
 */
class IfExist extends BaseNode {
	private _negation: boolean;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:IfExist");
		this._negation = false;
	}
	/**
	 * Odwaracamy działanie Node. Po włączeniu tej funkcji node blokuje connection gdy ma dane wejściowe
	 */
	public setNegation(){
		this._negation = true;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			this.debug("begin");
			var processObject: IProcessObject = processObjectList[this.processId];
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug("isNegation: " + this._negation);
			this.debug(mappedEntry);
			if (mappedEntry.length > 0 && this._negation === true) {
				this.debug("block connection");
				this.blockChildrenConnection(processObject);
			} else if(mappedEntry.length === 0 && this._negation === false) {
				this.debug("block connection");
				this.blockChildrenConnection(processObject);
			} else {
				this.debug("allow connection");

			}
			resolve(mappedEntry);
		});
	}
}
export = IfExist;