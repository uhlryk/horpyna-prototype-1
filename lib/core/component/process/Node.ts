import Element = require("./../../Element");
import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
class Node extends Element {
	private _childNodeList: Node[];
	private _parentNodeList: Node[];
	/**
	 * budując diagram musimy określić dla jakiego modelu jest ten element
	 * @param {ProcessModel} processModel obiekt danego modelu dla któ®ego są te elementy
	 */
	constructor(processModel?:ProcessModel){
		super();
		this._childNodeList = [];
		this._parentNodeList = [];
		if (processModel) {
			processModel.addNode(this);
		}
	}
	/**
	 * Dodaje listę innych nodów co zbuduje rozgałęzienie, te na liście mogą mieć kolejne rozgałęzienia
	 * A jeśli mamy rozgalęzienie to nodę który robił dane rozgałęzienie musi je sam zamknąć dając node który
	 * logicznie obsłuży wiele rozgałęzień (dowolny node)
	 */
	public addChildNode(node:Node){
		this._childNodeList.push(node);
		node.addParentNode(this);
	}
	public get childNodes():Node[]{
		return this._childNodeList;
	}
	public addParentNode(node: Node) {
		this._parentNodeList.push(node);
	}
	public get parentNodes():Node[]{
		return this._parentNodeList;
	}
	/**
	 * Wywołania w request
	 */

	/**
	 * Wywołuje to dla każdego node ProcessModel, nie w hierarchi ale jak na liście (struktura płaska)
	 * wywołuje to w request czyli w actionHandler
	 * @param {Request}  request  [description]
	 * @param {Response} response [description]
	 */
	public getProcessHandler(resolver: Util.Promise.Resolver<any>, parentResolverList: Util.Promise.Resolver<any>[], request: Request, response: Response) {
		Promise.all(parentResolverList)
		.then((response)=>{
			console.log(response);
			return this.content(response);
		})
		.then((response) => {
			resolver.resolve(response);
		});
	}
	/**
	 * Tu logika danego node. Zwrócić musi obiekt odpowiedzi
	 */
	protected content(processEntry: any): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			console.log("Z2");
			resolve(processEntry);
		});
	}
}
export = Node;