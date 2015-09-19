import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import NodeData = require("./../NodeData");
class SendData extends BaseNode{
	private _status: number;
	private _key: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:SendData");
	}
	public setStatus(v:number){
		this._status = v;
	}
	public setResponseKey(v: string){
		this._key = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
		this.debug(mappedEntry);
		data.getActionResponse().addValue(this._key || "content", mappedEntry);
		if(this._status){
			data.getActionResponse().status = this._status;
		}
		this.debug("null");
		return null;
	}
}
export = SendData;