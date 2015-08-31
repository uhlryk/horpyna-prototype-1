import Util = require("./../../../util/Util");
import BaseNode = require("./../BaseNode");
import NodeData = require("./../NodeData");
/**
 * Niezależnie co otrzyma zwraca []
 */
class Empty extends BaseNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Empty");
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		return [];
	}
}
export = Empty;