import Core = require("./../../../index");
import BaseNode = require("./BaseNode");
/**
 * Rozpoczynająca łańcuch procesów biznesowych.
 * Jest podpinana do ActionHandlera. I do niej się podpina kolejne node'y
 * Jest to obiekt który odpowiada jednemu procesowi biznesowemu
 */
class ProcessModel extends BaseNode{
	private _allNodeList: Core.Node.BaseNode[];
	constructor(parent: Core.Action.BaseAction | Core.Event.BaseEvent){
		this._allNodeList = [];
		this.setProcessModel(this);
		super();
		this.initDebug("process");
		if (parent instanceof Core.Action.BaseAction){
			parent.setActionHandler((request, response) => {
				return this.handler(request, response);
			});
		} else if (parent instanceof Core.Event.BaseEvent) {
			parent.addCallback((request, response, done) => {
				this.handler(request, response)
				.then(()=>{
					done();
				});
			});
		}
	}
	protected handler(request: Core.Action.Request, response: Core.Action.Response): Core.Util.Promise<void> {
		return Core.Util.Promise.resolve()
		.then(()=>{
			var processNodeList: Core.Node.IProcessObject[] = [];
			//dla każdego node tworzymy promise i tu mamy całą listę
			var nodePromiseList: Core.Util.Promise<void>[] = [];
			for (var i = 0; i < this._allNodeList.length; i++) {
				var node: Core.Node.BaseNode = this._allNodeList[i];
				var resolve;
				var promise = new Core.Util.Promise<void>(function() {
					resolve = arguments[0];
				})
				var processObject = <Core.Node.IProcessObject>{
					promise: promise,
					resolver: resolve,
					response: null,
					node: node,
				};
				processObject.childrenConnections = [];
				processObject.parentConnections = [];
				processNodeList[i] = processObject;
				nodePromiseList[i] = promise;
			}
			for (var i = 0; i < this._allNodeList.length; i++) {
				var node: Core.Node.BaseNode = this._allNodeList[i];
				var processObject = processNodeList[node.processId];
				/**
				 * dla każdego Node w processNodeList tworzy connections które są jako obiekty dzielone z dziećmi
				 * zaczynamy od listowania dzieci danego Node i stworzenie tyle connections ile jest dzieci.
				 * Connections są doddawane do processNodeList danego Node jako childrenConnections
				 * i do każdego dziecka jako parentConnections
				 */
				for (var j = 0; j < node.childNodes.length; j++){
					var childNode = node.childNodes[j];
					var childProcessObject = processNodeList[childNode.processId];
					var connection = <Core.Node.IConnection>{ open: true };//obiekt jest współdzielony więc jak go zmieni rodzic to dziecko też będzie miało zmieniony
					connection.parent = processObject;
					connection.child = childProcessObject;
					processObject.childrenConnections.push(connection);
					childProcessObject.parentConnections.push(connection);
				}
				if (node !== this) {
					node.getProcessHandler(processNodeList, request, response);
				}
			}
			//realizuje resolve tego elementu co powoduje kaskadowe odpalanie kolejnych BaseNode'ów
			processNodeList[this.processId].resolver();
			//zwraca promise jak wszystkie BaseNode zrealizują swój obiekt resolver
			return Core.Util.Promise.all<void>(nodePromiseList)
			.then(function(){

			});
		});
	}
	public addNode(node: Core.Node.BaseNode): number {
		this._allNodeList.push(node);
		return this._allNodeList.length - 1;
	}
}
export = ProcessModel;