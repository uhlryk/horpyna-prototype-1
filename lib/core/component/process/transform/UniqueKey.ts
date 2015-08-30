import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
/**
 * zwraca listę kluczy unikalnych;
 * @Deprecated nie używać tego bo jest niepotrzebne a może mieć błędy
 */
class UniqueKey extends BaseNode{
	private _key: string;
	constructor(parentNodeList:BaseNode[]) {
		super(parentNodeList);
		this._key = "0";
		this.initDebug("node:UniqueKey");
	}
	protected content(processEntryList: any[], actionRequest: Request, actionResponse: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, actionRequest);
			this.debug(mappedEntry);
			var nodeResponse = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				var row = mappedEntry[i];
				for (var key in row) {
					var obj = new Object();
					obj[this._key] = key;
					nodeResponse.push(obj);
				}
			}
			this.debug(nodeResponse);
			resolve(nodeResponse);
		});
	}
	public setKey(v: string){
		this._key = v;
	}
	public getKey():string{
		return this._key;
	}
}
export = UniqueKey;