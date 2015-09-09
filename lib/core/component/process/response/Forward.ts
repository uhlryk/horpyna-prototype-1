import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeData = require("./../NodeData");
/**
 * W dispatcherze pozwoli zaraz po danej akcji odpalić od razu następną wskazaną w forward
 */
class Forward extends BaseNode {
	private _action: BaseAction;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Forward");
	}
	/**
	 * wskazujemy akcję do której ma być redirect
	 * @param {BaseAction} v [description]
	 */
	public setTargetAction(v: BaseAction) {
		this._action = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		data.getActionResponse().setForwardAction(this._action);
		this.debug("forward: " + this._action);
		return null;
	}
}
export = Forward;