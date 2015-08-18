import Element = require("./../../Element");
import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import IProcessObject = require("./IProcessObject");
import IConnection = require("./IConnection");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import NodeMapper = require("./NodeMapper");
class BaseNode extends Element {
	private _childNodeList: BaseNode[];
	private _parentNodeList: BaseNode[];
	/**
	 * Index jaki node ma na liście w danym processModel
	 */
	private _processId: number;
	/**
	 * budując diagram musimy określić dla jakiego modelu jest ten element
	 * @param {ProcessModel} processModel obiekt danego modelu dla któ®ego są te elementy
	 */
	 private _nodeMapper: NodeMapper;
	constructor(processModel:ProcessModel){
		super();
		this._nodeMapper = new NodeMapper();
		this._nodeMapper.addDefaultMapSource("entry_source", NodeMapper.RESPONSE_NODE);
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
	 * Metoda mapująca, opis pul przy this._mapSource
	 * @param {string}   name [description]
	 * @param {string}   sourceType [description]
	 * @param {string[]} key  [description]
	 */
	public addMapSource(name:string, sourceType:string, key?:string[]){
		this._nodeMapper.addMapSource(name, sourceType, key);
	}
	/**
	 * Podobne do powyższego ale zamiast dodawać ustawia, jeśli więc jest wpis pod danym name to zostanie zastąpiony
	 * key może być też tylko jednym wpisem
	 */
	public setMapSource(name: string, sourceType: string, key: string) {
		this._nodeMapper.setMapSource(name, sourceType, key);
	}
	/**
	 * Mapowanie moze zwrócić null jeśli brak elementów lub gdy nie zostały ustawione, czasem chcemy
	 * w zależności od sytuacji odpowiednio się zachować np jeśli nie ustawiliśmy w find where to używamy entry_source map
	 */
	public isMapSourceSet(name: string) {
		return this._nodeMapper.isMapSourceSet(name);
	}
	/**
	 * Określamy źródło danych wejściowych. Jeśli nie określimy to źródłem będzie tablica odpowiedzi node'ów poprzednich
	 */
	public addEntryMapSource(sourceType: string, key?: string[]) {
		this._nodeMapper.addMapSource("entry_source", sourceType, key);
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
	 * Dla danego mapowania (po nazwie - name) budujemy mappedSource odpowiedź. jej forma zależy od mapType
	 * @param  {string}  name         odpowiada name w _mapSource
	 * @param  {string}  mapType  określa jak mają być zamapowane strumienie, aktualnie mamy ObjectArray, Object, PrimitiveArray, Primitive
	 * @param  {any[]}   processEntry odpowiedź z poprzedniego Node
	 * @param  {Request} request      actionRequest
	 * @return {Object}               zwraca obiekt z key:value gdzie key to string a value:any
	 */
	public getMappedSource(name: string, mapType:string, processEntryList: Object[], request: Request): any {
		return this._nodeMapper.getMappedSource(name, mapType, processEntryList, request);
	}
	public getMappedObjectArray(name: string, processEntryList: Object[], request: Request):Object[] {
		return this.getMappedSource(name, NodeMapper.MAP_OBJECT_ARRAY, processEntryList, request);
	}
	public getMappedObject(name: string, processEntryList: Object[], request: Request):Object {
		return this.getMappedSource(name, NodeMapper.MAP_OBJECT, processEntryList, request);
	}
	public getMappedValueArray(name: string, processEntryList: Object[], request: Request): any[] {
		return this.getMappedSource(name, NodeMapper.MAP_VALUE_ARRAY, processEntryList, request);
	}
	public getMappedValue(name: string, processEntryList: Object[], request: Request): any {
		return this.getMappedSource(name, NodeMapper.MAP_VALUE, processEntryList, request);
	}
	public getEntryMappedSource(mapType: string, processEntryList: Object[], request: Request): any {
		return this.getMappedSource("entry_source", mapType, processEntryList, request);
	}
	public getEntryMappedObjectArray(processEntryList: Object[], request: Request): Object[] {
		return this.getMappedObjectArray("entry_source", processEntryList, request);
	}
	public getEntryMappedObject(processEntryList: Object[], request: Request): Object {
		return this.getMappedObject("entry_source", processEntryList, request);
	}
	public getEntryMappedValueArray(processEntryList: Object[], request: Request): any[] {
		return this.getMappedValueArray("entry_source", processEntryList, request);
	}
	public getEntryMappedValue(processEntryList: Object[], request: Request): any {
		return this.getMappedValue("entry_source", processEntryList, request);
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