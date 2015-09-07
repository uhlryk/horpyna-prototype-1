import Element = require("./../../Element");
import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import IProcessObject = require("./IProcessObject");
import IConnection = require("./IConnection");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import NodeMapper = require("./NodeMapper");
import SourceType = require("./SourceType");
import NodeData = require("./NodeData");
class BaseNode extends Element {
	private _childNodeList: BaseNode[];
	private _parentNodeList: BaseNode[];
	/**
	 * Index jaki node ma na liście w danym processModel
	 */
	private _processId: number;
	private _processModel: ProcessModel;
	/**
	 * budując diagram musimy określić dla jakiego modelu jest ten element
	 * @param {ProcessModel} processModel obiekt danego modelu dla któ®ego są te elementy
	 */
	private _nodeMapper: NodeMapper;
	private _promiseContent: (data: NodeData) => Util.Promise<any>;
	private _content: (data: NodeData) => any;
	constructor(parentNodeList?:BaseNode[]){
		super();
		this.initDebug("node:");
		this._promiseContent = this.promiseContent;
		this._content = this.content;
		this._nodeMapper = new NodeMapper();
		this._nodeMapper.addDefaultMapSource("entry_source", SourceType.RESPONSE_NODE);
		this._childNodeList = [];
		if (parentNodeList) {
			this._parentNodeList = parentNodeList;
			for (var i = 0; i < this._parentNodeList.length; i++) {
				var parent = this._parentNodeList[i];
				parent.addChildNode(this);
			}
			this.setProcessModel(this._parentNodeList[0].processModel);
		}
		this._processId = this.processModel.addNode(this);
	}
	protected setProcessModel(v:ProcessModel){
		this._processModel = v;
	}
	public get processModel(): ProcessModel {
		return this._processModel;
	}
	public get processId():number{
		return this._processId;
	}
	/**
	 * Metoda mapująca, opis pul przy this._mapSource
	 */
	public addMapSource(name:string, sourceType:string, sourceKey?:string[]){
		this._nodeMapper.addMapSource(name, sourceType, sourceKey);
	}
	/**
	 * Podobne do powyższego ale zamiast dodawać ustawia, jeśli więc jest wpis pod danym name to zostanie zastąpiony
	 * sourceKey może być też tylko jednym wpisem
	 */
	public setMapSource(name: string, sourceType: string, sourceKey: string) {
		this._nodeMapper.setMapSource(name, sourceType, sourceKey);
	}
	/**
	 * jeśli nie ustawiliśmy mapowania pod daną nazwą zwróci true
	 * Mapowanie moze zwrócić null jeśli brak elementów lub gdy nie zostały ustawione, czasem chcemy
	 * w zależności od sytuacji odpowiednio się zachować np jeśli nie ustawiliśmy w find where to używamy entry_source map
	 */
	public isMapSourceSet(name: string) {
		return this._nodeMapper.isMapSourceSet(name);
	}
	/**
	 * Określamy źródło danych wejściowych. Jeśli nie określimy to źródłem będzie tablica odpowiedzi node'ów poprzednich
	 */
	public addEntryMapSource(sourceType: string, sourceKey?: string[]) {
		this._nodeMapper.addMapSource("entry_source", sourceType, sourceKey);
	}
	/**
	 * Dodaje listę innych nodów co zbuduje rozgałęzienie, te na liście mogą mieć kolejne rozgałęzienia
	 * A jeśli mamy rozgalęzienie to nodę który robił dane rozgałęzienie musi je sam zamknąć dając node który
	 * logicznie obsłuży wiele rozgałęzień (dowolny node)
	 */
	public addChildNode(node:BaseNode){
		this._childNodeList.push(node);
	}
	public get childNodes():BaseNode[]{
		return this._childNodeList;
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
	public getProcessHandler(processList: IProcessObject[], actionRequest: Request, actionResponse: Response) {
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
			// for (var i = 0; i < processObject.parentConnections.length; i++) {
			// 	var connection : IConnection = processObject.parentConnections[i];
			// 	if (connection.open === true) {
			// 		allowProcessResponseList.push(connection.parent.response);
			// 	}
			// }
			for (var j = 0; j < this._parentNodeList.length; j++){
				var parentNode: BaseNode = this._parentNodeList[j];
				for (var i = 0; i < processObject.parentConnections.length; i++) {
					var connection : IConnection = processObject.parentConnections[i];
					if (connection.parent.node === parentNode && connection.open == true) {
						allowProcessResponseList.push(connection.parent.response);
						break;
					}
				}
			}
			//content odpali się tylko jeśli przynajmniej jeden rodzic jest allow
			if (allowProcessResponseList.length > 0) {
				var data = new NodeData(this._nodeMapper, allowProcessResponseList, actionRequest, actionResponse, processList);
				return this._promiseContent(data);
			} else{
				//jeśli żaden rodzic nie jest allow to blokujemy wszystkie connection wychodzące od tego Node
				this.blockChildrenConnection(processObject);
			}
		})
		.then((processResponse) => {//odpowiedź z content
			processList[this.processId].response = processResponse || null;
			processList[this.processId].resolver();
		});
	}
	/**
	 * Gdy wszyskie połączenia od rodziców są zablokowane to następuje blokada połączeń wychodzących od tego Node
	 */
	protected blockChildrenConnection(processObject: IProcessObject) {
		var connectionList: IConnection[] = processObject.childrenConnections;
		for (var i = 0; i < connectionList.length; i++){
			var connection = connectionList[i];
			connection.open = false;
		}
	}
	/**
	 * Tu logika danego node. Zwrócić musi obiekt odpowiedzi
	 * @param  {IProcessObject} processObject obiekt pozwala zablokować strumień danych
	 */
	protected promiseContent(data: NodeData): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			resolve(this._content(data));
		});
	}
	protected content(data: NodeData): any {
		return null;
	}
	/**
	 * pozwala nadpisać logikę danego node
	 */
	public setPromiseContent(v: (data: NodeData) => Util.Promise<any>) {
		this._promiseContent = v;
	}
	public setContent(v: (data: NodeData) => any) {
		this._content = v;
	}
}
export = BaseNode;