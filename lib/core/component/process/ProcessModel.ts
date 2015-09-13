import IActionHandler = require("./../routeComponent/module/action/IActionHandler");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import Util = require("./../../util/Util");

import BaseNode = require("./BaseNode");
import IProcessObject = require("./IProcessObject");
import IConnection = require("./IConnection");
// import ProcessShareObject = require("./ProcessShareObject");
/**
 * Rozpoczynająca łańcuch procesów biznesowych.
 * Jest podpinana do ActionHandlera. I do niej się podpina kolejne node'y
 * Jest to obiekt który odpowiada jednemu procesowi biznesowemu
 */
class ProcessModel extends BaseNode{
	private _actionHandler: IActionHandler;
	private _allNodeList: BaseNode[];
	constructor(){
		this._allNodeList = [];
		this.setProcessModel(this);
		super();
		this.initDebug("process");
		this._actionHandler = this.actionHandler;
	}
	protected actionHandler(request: Request, response: Response): Util.Promise<void> {
		return Util.Promise.resolve()
		.then(()=>{
			var processNodeList:IProcessObject[] = [];
			//dla każdego node tworzymy promise i tu mamy całą listę
			var nodePromiseList: Util.Promise<void>[] = [];

			for (var i = 0; i < this._allNodeList.length; i++) {
				var node: BaseNode = this._allNodeList[i];
				var resolve;
				var promise = new Util.Promise<void>(function() {
					resolve = arguments[0];
				})

				var processObject = <IProcessObject>{
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
				var node: BaseNode = this._allNodeList[i];
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
					var connection = <IConnection>{ open: true };//obiekt jest współdzielony więc jak go zmieni rodzic to dziecko też będzie miało zmieniony
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
			return Util.Promise.all<void>(nodePromiseList)
			.then(function(){

			});
		});
	}
	public addNode(node:BaseNode): number{
		this._allNodeList.push(node);
		return this._allNodeList.length - 1;
	}
	/**
	 * Wywoływane w action handler
	 * @return {IActionHandler} [description]
	 */
	public getActionHandler():IActionHandler{
		return (request, response) => {
			return this._actionHandler(request, response);
		};
	}
}
export = ProcessModel;