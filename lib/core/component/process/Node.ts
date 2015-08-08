import Element = require("./../../Element");
import Util = require("./../../util/Util");
class Node extends Element{
	private _beginNodeList: Node[];
	private _endNodeList: Node[];
	constructor(){
		super();
	}
	public begin(nodeList:Node[]){
		this._beginNodeList = nodeList;
	}
	public end(nodeList:Node[]){
		this._endNodeList = nodeList;
	}
	public linkPromise(processEntry:Object): Util.Promise<Object>{
		var processResponse = {
			// w tym obiekcie będą jeszcze odpowiedzi niestandardowe określone dla danego Node
			paramField: processEntry['paramField'],
			appField: processEntry['appField'],
			queryField: processEntry['queryField'],
			bodyField: processEntry['bodyField'],
			headerField: processEntry['headerField'],
			fileField: processEntry['fileField'],
			system : processEntry['system']
		};

		return this.content(processEntry, processResponse)
		.then((processResponse:Object) => {
			//dalsza część łańcucha
			if (this._beginNodeList) {
				return Util.Promise.map(this._beginNodeList, (node: Node) => {
					return node.linkPromise(processResponse);
				})
				.then((processResponseList:Object[]) => {
					if (this._endNodeList) {
						return Util.Promise.map(this._endNodeList, (node: Node) => {
							// return node.linkPromise();
						});
					}
				});
			}
		});
	}
	/**
	 * Tu logika danego node. Zwrócić musi obiekt odpowiedzi
	 * Obiekt ten częściowo jest już zbudowany. Musi dorzucić swoje odpowiedzi do odpowiedzi standardowych
	 * @return {Util.Promise<Object>} [description]
	 */
	protected content(processEntry: Object, processResponse: Object): Util.Promise<Object> {
		return new Util.Promise<Object>((resolve:(processResponse:Object)=>void)=>{
			resolve(processResponse);
		});
	}
}
export = Node;