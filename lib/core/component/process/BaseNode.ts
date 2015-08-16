import Element = require("./../../Element");
import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import IProcessObject = require("./IProcessObject");
import IConnection = require("./IConnection");
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
	 * Index jaki node ma na liście w danym processModel
	 */
	private _processId: number;
	/**
	 * budując diagram musimy określić dla jakiego modelu jest ten element
	 * @param {ProcessModel} processModel obiekt danego modelu dla któ®ego są te elementy
	 */
	constructor(processModel:ProcessModel){
		super();
		this._dataMapper = new Object();
		this._childNodeList = [];
		this._parentNodeList = [];
		if (processModel) {
			this._processId = processModel.addNode(this);
		}
	}
	public get processId():number{
		return this._processId;
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
	 * Podobne do powyższego ale zamiast dodawać ustawia, jeśli więc jest wpis pod danym name to zostanie zastąpiony
	 * key może być też tylko jednym wpisem
	 */
	public setMapper(name: string, type: string, key: string) {
		this._dataMapper[name] = new Object();
		this._dataMapper[name][type] = [];
		this._dataMapper[name][type].push(key);
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
	 * z danej listy z szczegółami procesów tworzy listę promisów rodziców danego node
	 * @param {IProcessObject[]} processList [description]
	 */
	protected getParentPromiseList(processList: IProcessObject[]): (Util.Promise<void>)[] {
		var parentPromiseList: Util.Promise<void>[] = [];
		for (var i = 0; i < this._parentNodeList.length; i++) {
			var parentNode = this._parentNodeList[i];
			var parentProcessId = parentNode.processId;
			parentPromiseList.push(processList[parentProcessId].promise);
		}
		return parentPromiseList;
	}
	/**
	 * Wywołuje to dla każdego node ProcessModel, nie w hierarchi ale jak na liście (struktura płaska)
	 * wywołuje to w request czyli w actionHandler
	 * @param {Request}  request  [description]
	 * @param {Response} response [description]
	 */
	public getProcessHandler(processList: IProcessObject[], request: Request, response: Response) {
		// parentResolverList[0].
		var parentPromiseList = this.getParentPromiseList(processList);
		Util.Promise.all<void>(parentPromiseList)
		/**
		 * response jest tablicą odpowiedzi z rodziców. Większość Node używa tylko jednego strumienia odpowiedzi,
		 * Jeśli otrzyma ich więcej to używa odpowiedz defaultowej czyli pierwszego zarejestrowanego rodzica.
		 */
		.then(()=>{
			//do content dodamy tylko te response, dla których connection jest otwarte
			var allowProcessResponseList = [];
			var processObject = processList[this.processId];
			for (var i = 0; i < processObject.parentConnections.length; i++) {
				var connection : IConnection = processObject.parentConnections[i];
				if (connection.open === true) {
					allowProcessResponseList.push(connection.parent.response);
				}
			}
			//content odpali się tylko jeśli przynajmniej jeden rodzic jest allow
			if (allowProcessResponseList.length > 0) {
				return this.content(allowProcessResponseList, request, response, processList);
			} else{
				//jeśli żaden rodzic nie jest allow to blokujemy wszystkie connection wychodzące od tego Node
				this.onAllChildrenConnectionBlocked(processObject);
			}
		})
		.then((response) => {//odpowiedź z content
			processList[this.processId].response = response || null;
			processList[this.processId].resolver();
		});
	}
	/**
	 * Gdy wszyskie połączenia od rodziców są zablokowane to następuje blokada połączeń wychodzących od tego Node
	 */
	protected onAllChildrenConnectionBlocked(processObject: IProcessObject) {
		var connectionList: IConnection[] = processObject.childrenConnections;
		for (var i = 0; i < connectionList.length; i++){
			var connection = connectionList[i];
			connection.open = false;
		}
	}
	/**
	 * Dla jakiego name zamapowanego chcemy wyciągnąć obiekt z konkretnymi odpowiedziami
	 * @param  {string}  name         odpowiada name w _dataMapper
	 * @param  {any[]}   processEntry odpowiedź z poprzedniego Node
	 * @param  {Request} request      actionRequest
	 * @return {Object}               zwraca obiekt z key:value gdzie key to string a value:any
	 */
	public mapResponse(name: string, processEntry: Object, request: Request): Object {
		var mapResponse = null;
		if (this._dataMapper[name]) {
			mapResponse = new Object();
			for (var type in this._dataMapper[name]) {
				var typeKeys = this._dataMapper[name][type];
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
	 * @param  {IProcessObject} processObject obiekt pozwala zablokować strumień danych
	 */
	protected content(processEntryList: any[], request: Request, response: Response, processList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			resolve(null);
		});
	}
}
export = BaseNode;