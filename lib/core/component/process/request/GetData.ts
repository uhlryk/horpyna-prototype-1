import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import IProcessObject = require("./../IProcessObject");
import NodeData = require("./../NodeData");
/**
 * Zwraca obiekt znajdujący się pod danym kluczem w Action Require
 */
class GetData extends BaseNode {
	private _key: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:GetData");
	}
	public setKey(v: string){
		this._key = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		if (this._key){
			var nodeResponse = [];
			var responseData = data.getActionRequest().getValue(this._key);
			if (responseData) {
				nodeResponse.push(responseData);
			}
			this.debug(nodeResponse);
			return nodeResponse;
		}
		return [];
	}
}
export = GetData;