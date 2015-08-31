import Util = require("./../../../util/Util");
import BaseNode = require("./../BaseNode");
import NodeData = require("./../NodeData");
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
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
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
		return nodeResponse;
	}
	public setKey(v: string){
		this._key = v;
	}
	public getKey():string{
		return this._key;
	}
}
export = UniqueKey;