import BaseNode = require("./../BaseNode");
import Model = require("./../../routeComponent/module/model/Model");
import Util = require("./../../../util/Util");
import ProcessModel = require("./../ProcessModel");
class BaseDbNode extends BaseNode {
	private model: Model;
	constructor(processModel: ProcessModel) {
		super(processModel);
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