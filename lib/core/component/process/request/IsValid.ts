import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import IProcessObject = require("./../IProcessObject");
import NodeData = require("./../NodeData");
/**
 * Sprawdza czy request jest zwalidowany
 */
class IsValid extends BaseNode {
	private _negation: boolean;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:IsValid");
		this._negation = false;
	}
	/**
	 * Odwaracamy działanie Node. Po włączeniu tej funkcji node blokuje connection gdy ma dane wejściowe
	 */
	public setNegation() {
		this._negation = true;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var processObject: IProcessObject = data.getProcessList()[this.processId];
		var isValid = data.getActionRequest().isActionValid();
		this.debug("isNegation: " + this._negation);
		this.debug("isValid: " + isValid);
		if (isValid && this._negation === true) {
			this.debug("block connection");
			this.blockChildrenConnection(processObject);
		} else if (isValid === false && this._negation === false) {
			this.debug("block connection");
			this.blockChildrenConnection(processObject);
		} else {
			this.debug("allow connection");

		}
		return [];
	}
}
export = IsValid;