import Element = require("./../../Element");
import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
class BaseNode extends Element {
	public static NODE_RESPONSE: string = "node";

	private _childNodeList: BaseNode[];
	private _parentNodeList: BaseNode[];
	/**
	 * Możemy zrobić mapowanie tak że np jeśli Node oczekuje danych do WHERE to możemy określić że ma jako te dane brać całe QUERY_FIELD
	 * name jest to klucz do jakiegoś pola specyficznego dla danego Node
	 * type to może być PARAM_FIELD, QUERY_FIELD itp z request, key to tablica z określonymi kluczami, pusta tablica - weźmie wszystkie
	 * jeśli wywołamy kilka razy addMapper z tym samym name to zostaną te dane zmergowane
	 * Możemy też jako typ zamapować wynik otrzymany z poprzedniego Node!!! W tej sytuacji typ = NODE_RESPONSE
	 * @type {name: {type:[key]}}
	 */
	private _dataMapper: Object;
	/**
	 * budując diagram musimy określić dla jakiego modelu jest ten element
	 * @param {ProcessModel} processModel obiekt danego modelu dla któ®ego są te elementy
	 */
	constructor(processModel?:ProcessModel){
		super();
		this._dataMapper = new Object();
		this._childNodeList = [];
		this._parentNodeList = [];
		if (processModel) {
			processModel.addNode(this);
		}
	}
	/**
	 * Metoda mapująca, opis pul przy this._dataMapper
	 * @param {string}   name [description]
	 * @param {string}   type [description]
	 * @param {string[]} key  [description]
	 */
	public addMapper(name:string, type:string, key?:string[]){
		if(!this._dataMapper[name]){
			this._dataMapper[name] = new Object();
		}
		if(!this._dataMapper[name][type]){
			this._dataMapper[name][type] = [];
		}
		if(key){
			for (var i = 0; i < key.length; i++){
				var k: string = key[i];
				if (this._dataMapper[name][type].indexOf(k) === -1){
					this._dataMapper[name][type].push(k);
				}
			}
		}
	}
	/**
	 * Dodaje listę innych nodów co zbuduje rozgałęzienie, te na liście mogą mieć kolejne rozgałęzienia
	 * A jeśli mamy rozgalęzienie to nodę który robił dane rozgałęzienie musi je sam zamknąć dając node który
	 * logicznie obsłuży wiele rozgałęzień (dowolny node)
	 */
	public addChildNode(node:BaseNode){
		this._childNodeList.push(node);
		node.addParentNode(this);
	}
	public get childNodes():BaseNode[]{
		return this._childNodeList;
	}
	public addParentNode(node: BaseNode) {
		this._parentNodeList.push(node);
	}
	public get parentNodes():BaseNode[]{
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
	public getProcessHandler(resolver: (processResponse: Object) => void, parentResolverList: Util.Promise<Object>[], request: Request, response: Response) {
		// parentResolverList[0].
		Util.Promise.all<Object>(parentResolverList)
		/**
		 * response jest tablicą odpowiedzi z rodziców. Większość Node używa tylko jednego strumienia odpowiedzi,
		 * Jeśli otrzyma ich więcej to używa odpowiedz defaultowej czyli pierwszego zarejestrowanego rodzica.
		 */
		.then((processResponseList)=>{
			console.log(response);
			return this.content(processResponseList, request, response);
		})
		.then((response) => {//odpowiedź z content
			console.log(response);
			resolver(response);
		});
	}
	/**
	 * Dla jakiego name zamapowanego chcemy wyciągnąć obiekt z konkretnymi odpowiedziami
	 * @param  {string}  name         odpowiada name w _dataMapper
	 * @param  {any[]}   processEntry odpowiedź z poprzedniego Node
	 * @param  {Request} request      actionRequest
	 * @return {Object}               zwraca obiekt z key:value gdzie key to string a value:any
	 */
	public mapResponse(name:string, processEntry: any, request: Request):Object{
		var mapResponse = new Object();
		if (this._dataMapper[name]) {
			for (var type in this._dataMapper) {
				var typeKeys = this._dataMapper[type];
				var typeData;
				switch(type){
					case BaseNode.NODE_RESPONSE:
						typeData = processEntry;
						break;
					default:
						typeData = request.getFieldList(type);
				}
				for (var key in typeData){
					var value = typeData[key];
					if (typeKeys.length === 0 || typeKeys.indexOf(key) !== -1){
						mapResponse[key] = value;
					}
				}
			}
		}
		return mapResponse;
	}
	/**
	 * Tu logika danego node. Zwrócić musi obiekt odpowiedzi
	 */
	protected content(processEntryList: Object[], request: Request, response: Response): Util.Promise<Object> {
		return new Util.Promise<Object>((resolve: (processResponse: Object) => void) => {
			resolve({});
		});
	}
}
export = BaseNode;