import BaseNode = require("./../BaseNode");
import ProcessModel = require("./../ProcessModel");
import IProcessObject = require("./../IProcessObject");
import IConnection = require("./../IConnection");
class BaseGateway extends BaseNode {
	private _positiveNode: BaseNode[];
	private _negativeNode: BaseNode[];
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:BaseGatway");
		this._positiveNode = []
		this._negativeNode = []
	}
	protected getPositiveNodeList(): BaseNode[] {
		return this._positiveNode;
	}
	protected getNegativeNodeList(): BaseNode[] {
		return this._negativeNode;
	}
	private addPositiveNode(node: BaseNode) {
		this._positiveNode.push(node);
	}
	private addNegativeNode(node: BaseNode) {
		this._negativeNode.push(node);
	}
	//jeśli  Node otrzyma wartość z obiektem z połączenia otwartego to
	public addPositiveChildNode(node: BaseNode) {
		this.addChildNode(node);
	}
	public addChildNode(node: BaseNode) {
		super.addChildNode(node);
		this.addPositiveNode(node);
	}
	public addNegativeChildNode(node: BaseNode) {
		super.addChildNode(node);
		this.addNegativeNode(node);
	}
	/**
	 * blokuje wszystkie połączenia które są ustawione jako połączenia "positive"
	 */
	public blockPositiveNode(processObject: IProcessObject) {
		var connectionList: IConnection[] = processObject.childrenConnections;
		for (var i = 0; i < connectionList.length; i++) {
			var connection = connectionList[i];
			if (this.getPositiveNodeList().indexOf(connection.child.node) !== -1) {
				connection.open = false;
			}
		}
	}
	/**
	 * blokuje wszystkie połączenia które są ustawione jako połączenia "negative"
	 */
	public blockNegativeNode(processObject: IProcessObject) {
		var connectionList: IConnection[] = processObject.childrenConnections;
		for (var i = 0; i < connectionList.length; i++) {
			var connection = connectionList[i];
			if (this.getNegativeNodeList().indexOf(connection.child.node) !== -1) {
				connection.open = false;
			}
		}
	}
}
export = BaseGateway;