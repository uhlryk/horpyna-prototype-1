import IActionHandler = require("./../routeComponent/module/action/IActionHandler");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import BaseAction = require("./../routeComponent/module/action/BaseAction");
import Util = require("./../../util/Util");

import Node = require("./Node");
// import ProcessShareObject = require("./ProcessShareObject");
/**
 * Rozpoczynająca łańcuch procesów biznesowych.
 * Jest podpinana do ActionHandlera. I do niej się podpina kolejne node'y
 * Jest to obiekt który odpowiada jednemu procesowi biznesowemu
 */
class ProcessModel extends Node{
	private _actionHandler: IActionHandler;
	private _allNodeList: Node[];
	constructor(){
		super();
		this.initDebug("process");
		this._actionHandler = this.actionHandler;
		this._allNodeList = [this];
	}
	protected actionHandler(request: Request, response: Response, action: BaseAction): Util.Promise<void> {
		return Util.Promise.resolve()
		.then(()=>{
			var nodeResolverList: ((response?: any) => void)[] = [];
			var nodePromiseList: Util.Promise<any>[] = [];
			var parentPromiseList: Util.Promise<any>[][] = [];
			/**
			 * dla każdego node budujemy tyle deffered objects ile ma dzieci.
			 * Każde dziecko dostaje jeden taki obiekt od danego rodzica. Ale moze mieć wiele rodziców
			 * Jeśli wszyscy rodzice wykonają swoje promise to dziecko na podstawie realizacji wszystkich deffered objectów
			 * będzie miało informację że może teraz swoje procesy rozpocząć
			 */
			for (var i = 0; i < this._allNodeList.length; i++) {
				var node: Node = this._allNodeList[i];
				// var resolver = Util.Promise.defer<any>();
				var resolve;
				var promise = new Util.Promise<any>(function(){
					resolve = arguments[0];
				})
				nodePromiseList[i] = promise;
				nodeResolverList[i] = resolve;
				for (var j = 0; j < node.childNodes.length; j++) {
					var childNode: Node = node.childNodes[j];
					//szukamy indexu pod jakim występuje na liście wszystkich elementów dany childNode
					for (var z = 0; z < this._allNodeList.length; z++){
						var otherNode: Node = this._allNodeList[z];
						if (otherNode === childNode){
							if(!parentPromiseList[z]){
								parentPromiseList[z] = [];
							}
							parentPromiseList[z].push(promise);
						}
					}
				}
			}
			for (var i = 0; i < this._allNodeList.length; i++) {
				var node: Node = this._allNodeList[i];
				if (node !== this) {
					node.getProcessHandler(nodeResolverList[i], parentPromiseList[i], request, response);
				}
			}
			//realizuje resolve tego elementu co powoduje kaskadowe odpalanie kolejnych Node'ów
			nodeResolverList[0]();

			//zwraca promise jak wszystkie Node zrealizują swój obiekt resolver
			return Util.Promise.all<any>(nodePromiseList)
			.then(()=>{
			});
		});
	}
	public addNode(node:Node){
		this._allNodeList.push(node);
	}
	/**
	 * Wywoływane w action handler
	 * @return {IActionHandler} [description]
	 */
	public getActionHandler():IActionHandler{
		return (request, response, action) => {
			return this._actionHandler(request, response, action);
		};
	}
}
export = ProcessModel;