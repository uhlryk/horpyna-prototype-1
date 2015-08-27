import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
/**
 * zwraca listę kluczy unikalnych;
 */
class UniqueKey extends BaseNode{
	private _key: string;
	constructor(parentNodeList:BaseNode[]) {
		super(parentNodeList);
		this._key = "0";
		this.initDebug("node:UniqueKey");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			var responseArray = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				var row = mappedEntry[i];
				for (var key in row) {
					var obj = new Object();
					obj[this._key] = key;
					responseArray.push(obj);
				}
			}
			this.debug(responseArray);
			resolve(responseArray);
		});
	}
	public setKey(v: string){
		this._key = v;
	}
}
export = UniqueKey;