import BaseNode = require("./../BaseNode");
import Model = require("./../../routeComponent/module/model/Model");
import Util = require("./../../../util/Util");
class BaseDbNode extends BaseNode {
	private model: Model;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:BaseDbNode");
	}
	public setModel(model: Model) {
		this.model = model;
	}
	public getModel(): Model {
		return this.model;
	}
}
export = BaseDbNode;