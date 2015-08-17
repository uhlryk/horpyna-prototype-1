import Element = require("./../../Element");
import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import IProcessObject = require("./IProcessObject");
import IConnection = require("./IConnection");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
class BaseNode extends Element {
	public static NODE_RESPONSE: string = "node_response_stream";
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
	private _mapSource: Object;
	/**
	 * Wartość bazowo jest false; oznacza że mapowanie jakie jest przypisane do
	 * entry map jest domyślne
	 * Gdy dodajemy inne mapowanie to aplikacja sprawdzi czy mapowanie jest domyślne, wtedy zastąpi je nowym, jeśli nie jest domyślne
	 * to doda do poprzedniego
	 */
	private _mapSourceEntrySet: boolean;
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
		this._mapSource = new Object();
		this._mapSourceEntrySet = false;
		this.addMapSource("entry_source", BaseNode.NODE_RESPONSE);
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
		if(!this._mapSource[name]){
			this._mapSource[name] = new Object();
		}
		if(!this._mapSource[name][sourceType]){
			this._mapSource[name][sourceType] = [];
		}
		if(key){
			for (var i = 0; i < key.length; i++){
				var k: string = key[i];
				if (this._mapSource[name][sourceType].indexOf(k) === -1){
					this._mapSource[name][sourceType].push(k);
				}
			}
		}
	}
	/**
	 * Podobne do powyższego ale zamiast dodawać ustawia, jeśli więc jest wpis pod danym name to zostanie zastąpiony
	 * key może być też tylko jednym wpisem
	 */
	public setMapSource(name: string, sourceType: string, key: string) {
		this._mapSource[name] = new Object();
		this._mapSource[name][sourceType] = [];
		this._mapSource[name][sourceType].push(key);
	}
	/**
	 * Mapowanie moze zwrócić null jeśli brak elementów lub gdy nie zostały ustawione, czasem chcemy
	 * w zależności od sytuacji odpowiednio się zachować np jeśli nie ustawiliśmy w find where to używamy entry_source map
	 */
	public isMapSourceSet(name: string) {
		if (!this._mapSource[name]) {
			return false;
		}
		return true;
	}
	/**
	 * Określamy źródło danych wejściowych. Jeśli nie określimy to źródłem będzie tablica odpowiedzi node'ów poprzednich
	 */
	public addEntryMapSource(sourceType: string, key?: string[]) {
		if (this._mapSourceEntrySet === false){
			this._mapSourceEntrySet = true;
			//usuwamy domyślne mapowanie
			this._mapSource["entry_source"] = new Object();
		}
			this.addMapSource("entry_source", sourceType, key);
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
	public static MAP_OBJECT_ARRAY: string = "object_array";
	public static MAP_OBJECT: string = "object";
	public static MAP_VALUE_ARRAY: string = "value_array";//tablica pojedyńczych wartości prostych number lub string
	public static MAP_VALUE: string = "value";//pojedyncza wartość prosta, jakiś number lub string
	/**
	 * Dla danego mapowania (po nazwie - name) budujemy mappedSource odpowiedź. jej forma zależy od mapType
	 * @param  {string}  name         odpowiada name w _mapSource
	 * @param  {string}  mapType  określa jak mają być zamapowane strumienie, aktualnie mamy ObjectArray, Object, PrimitiveArray, Primitive
	 * @param  {any[]}   processEntry odpowiedź z poprzedniego Node
	 * @param  {Request} request      actionRequest
	 * @return {Object}               zwraca obiekt z key:value gdzie key to string a value:any
	 */
	public getMappedSource(name: string, mapType:string, processEntryList: Object[], request: Request): any {
		var mappedSource = null;
		if (this._mapSource[name]) {
			for (var sourceType in this._mapSource[name]) {
				var sourceTypeKeys = this._mapSource[name][sourceType];
				switch(sourceType){
					case BaseNode.NODE_RESPONSE:
						for (var i = 0; i < processEntryList.length; i++) {
							var processEntry = processEntryList[i];
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntry);
						}
						break;
					default:
						mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, request.getFieldList(sourceType));
				}
			}
		}
		return mappedSource;
	}
	/**
	 * mapuje pojedyńczy source
	 * Spsób mapowania zależy od mapType.
	 */
	protected mapSource(mappedSource, mapType: string, sourceTypeKeys: string[], sourceData:any):any {
		switch (mapType){
			/**
			 * sprawdza czy mamy tablicę wejściowa - mappedSource jeśli nie to ją tworzymy
			 * Jeśli dane wejściwe -sourceData są tablicą to iterujemy po każdym elemencie
			 * i interesują nas tylko te elementy które są obiektami, pozostałe ignorujemy
			 * dla każdego elementy tworzymy nowy obiekt z kluczamy tylko takimi jak są w - sourceTypeKeys - chyba że nie ustawione wtedy
			 * bierzemy wszystkie
			 * Jeśli dane wejściowe - sourceData to obiekt to tworzymy również nowy obiekt składający się z kluczy sourceTypeKeys
			 */
			case BaseNode.MAP_OBJECT_ARRAY:
				if (!mappedSource){
					mappedSource = [];
				}
				if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
					for (var i = 0; i < sourceData['length']; i++) {
						var streamObj = sourceData[i];
						if (Util._.isPlainObject(streamObj)) {
							var element = new Object();
							for (var key in streamObj) {
								var value = streamObj[key];
								if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
									element[key] = value;
								}
							}
							mappedSource.push(element);
						}
					}
				} else if (Util._.isPlainObject(sourceData)) {
					var element = new Object();
					for (var key in sourceData) {
						var value = sourceData[key];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
							element[key] = value;
						}
					}
					mappedSource.push(element);
				}
				break;
			/**
			 * Sprawdza czy mamy obiekt wejściowy - mappedSource - jeśli nie to go tworzymy
			 * Jeśli dane wejsćiowe to tablica to iterujemy i interesują nas elementy które są obiektami
			 * w każdym obiekcie klucze które są zgodne z sourceTypeKeys przenosimy do mappedSource- mogą się nadpisywać
			 * Jeśli dane wejściowe sourceData to obiekt to iterujemy po nim i do  mappedSource dodajemy te zgodne z sourceTypeKeys
			 */
			case BaseNode.MAP_OBJECT:
				if (!mappedSource){
					mappedSource = new Object();
				}
				if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
					for (var i = 0; i < sourceData['length']; i++) {
						var streamObj = sourceData[i];
						if (Util._.isPlainObject(streamObj)) {
							for (var key in streamObj) {
								var value = streamObj[key];
								if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
									mappedSource[key] = value;
								}
							}
						}
					}
				} else if (Util._.isPlainObject(sourceData)) {
					for (var key in sourceData) {
						var value = sourceData[key];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
							mappedSource[key] = value;
						}
					}
				}
				break;
			/**
			 * sprawdza czy mamy tablicę wejsiową - mappedSource - jeśli nie to ją tworzymy
			 * Jeśli dane wejściowe są tablicą to sprawdzamy czy to tablica obiektów
			 * jeśli tak to wyciągamy z każdego obiektu wartości których klucze są zgodne z sourceTypeKeys
			 * lub w przypadku nie ustawienia wszystkie wartości i wrzucamy do tablicy wejściowej
			 * Jeśli w tablicy nie ma obiektu tylko number, string boolean lub data to też zapisujemy w tablicy
			 * Jeśli dane wejściowe to obiekt to wyciągamy wartości których klucze są zgodne z sourceTypeKeys
			 * Jeśli dane wejściowe to tylko number, string boolean lub data to też zapisujemy w tablicy
			 */
			case BaseNode.MAP_VALUE_ARRAY:
				if (!mappedSource){
					mappedSource = [];
				}
				if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
					for (var i = 0; i < sourceData['length']; i++) {
						var streamObj = sourceData[i];
						if (Util._.isPlainObject(streamObj)) {
							for (var key in streamObj) {
								var value = streamObj[key];
								if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
									mappedSource.push(value);
								}
							}
						} else if (Util._.isNumber(streamObj) || Util._.isString(streamObj) || Util._.isBoolean(streamObj) || Util._.isDate(streamObj)){
							mappedSource.push(streamObj);
						}
					}
				} else if (Util._.isPlainObject(sourceData)) {
					for (var key in sourceData) {
						var value = sourceData[key];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
							mappedSource.push(value);
						}
					}
				} else if (Util._.isNumber(sourceData) || Util._.isString(sourceData) || Util._.isBoolean(sourceData) || Util._.isDate(sourceData)) {
					mappedSource.push(sourceData);
				}
				break;
			/**
			 * otrzymujemy pojedyńczą wartość, która może być wyciągnięta z tablicy obiektów, obiektu, tablicy czy wartości
			 */
			case BaseNode.MAP_VALUE:
				if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
					for (var i = 0; i < sourceData['length']; i++) {
						var streamObj = sourceData[i];
						if (Util._.isPlainObject(streamObj)) {
							for (var key in streamObj) {
								var value = streamObj[key];
								if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
									mappedSource = value;
								}
							}
						} else if (Util._.isNumber(streamObj) || Util._.isString(streamObj) || Util._.isBoolean(streamObj) || Util._.isDate(streamObj)){
							mappedSource = streamObj;
						}
					}
				} else if (Util._.isPlainObject(sourceData)) {
					for (var key in sourceData) {
						var value = sourceData[key];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
							mappedSource = value;
						}
					}
				} else if (Util._.isNumber(sourceData) || Util._.isString(sourceData) || Util._.isBoolean(sourceData) || Util._.isDate(sourceData)) {
					mappedSource = sourceData;
				}
				break;
		}
		return mappedSource;
	}
	public getMappedObjectArray(name: string, processEntryList: Object[], request: Request):Object[] {
		return this.getMappedSource(name, BaseNode.MAP_OBJECT_ARRAY, processEntryList, request);
	}
	public getMappedObject(name: string, processEntryList: Object[], request: Request):Object {
		return this.getMappedSource(name, BaseNode.MAP_OBJECT, processEntryList, request);
	}
	public getMappedValueArray(name: string, processEntryList: Object[], request: Request): any[] {
		return this.getMappedSource(name, BaseNode.MAP_VALUE_ARRAY, processEntryList, request);
	}
	public getMappedValue(name: string, processEntryList: Object[], request: Request): any {
		return this.getMappedSource(name, BaseNode.MAP_VALUE, processEntryList, request);
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