import Request = require("./../routeComponent/module/action/Request");
import Util = require("./../../util/Util");
import Element = require("./../../Element");
/**
 * Odpowiada za mapowanie danych source (PARAM_FIELD, QUERY_FIELD, BODY_FILED itp) na określony obiekt używany
 * w Node
 */
class NodeMapper extends Element{
	public static RESPONSE_NODE: string = "node_response_stream";
	public static RESPONSE_NODE_1: string = "node_response_stream_1";
	public static RESPONSE_NODE_2: string = "node_response_stream_2";
	public static RESPONSE_NODE_3: string = "node_response_stream_3";
	public static RESPONSE_NODE_4: string = "node_response_stream_4";
	public static RESPONSE_NODE_5: string = "node_response_stream_5";
	public static MAP_OBJECT_ARRAY: string = "object_array";
	public static MAP_OBJECT: string = "object";
	public static MAP_VALUE_ARRAY: string = "value_array";//tablica pojedyńczych wartości prostych number lub string
	public static MAP_VALUE: string = "value";//pojedyncza wartość prosta, jakiś number lub string
	public static MAP_RAW: string = "raw";//wszystko wrzuca do jednej tablicy
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
	 * Jest to obiekt klucz - name i wartość false | true
	 * Jeśli ustawimy true dla danego klucza to będzie oznaczać że dana wartość jest wartością default i
	 * przy dodaniu nowej wartości ma być usunięta
	 */
	private _mapSourceDefault: Object;
	constructor() {
		super();
		this.initDebug("nodemapper");
		this._mapSource = new Object();
		this._mapSourceDefault = new Object();
	}
	/**
	 * Metoda mapująca, opis pól przy this._mapSource
	 * @param {string}   name nazwa po której będziemy identyfikować mapowanie -pobieramy potem odpowiedź po ten nazwie
	 * @param {string}   sourceType jakie żródło jest danych param,app,query, ale też poprzedni response node
	 * @param {string[]} key  klucze jakie są brane pod uwagę w źródle - nie bierzemy całego źródła
	 */
	public addMapSource(name: string, sourceType: string, key?: string[]) {
		if (!this._mapSource[name] || this._mapSourceDefault[name] === true) {
			this._mapSource[name] = new Object();
			this._mapSourceDefault[name] = false;
		}
		if (!this._mapSource[name][sourceType]) {
			this._mapSource[name][sourceType] = [];
		}
		if (key) {
			for (var i = 0; i < key.length; i++) {
				var k: string = key[i];
				if (this._mapSource[name][sourceType].indexOf(k) === -1) {
					this._mapSource[name][sourceType].push(k);
				}
			}
		}
	}
	/**
	 * służy do ustawiania wartości defaultowej która jest tylko gdy nie zostanie utworzona nowa
	 * nowa usuwa tą defaultową
	 * dla setMapSource nie musimy tego ustawiać bo ona zawsze nadpisuje poprzednią wartość
	 */
	public addDefaultMapSource(name: string, sourceType: string, key?: string[]) {
		this._mapSourceDefault[name] = false;//ustawiamy false by można było dodać kolejną wartość do default zamiast ją zastąpić
		this.addMapSource(name, sourceType, key);
		this._mapSourceDefault[name] = true;
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
					case NodeMapper.RESPONSE_NODE:
						for (var i = 0; i < processEntryList.length; i++) {
							var processEntry = processEntryList[i];
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntry);
						}
						break;
					case NodeMapper.RESPONSE_NODE_1:
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntryList[0]);
						break;
					case NodeMapper.RESPONSE_NODE_2:
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntryList[1]);
						break;
					case NodeMapper.RESPONSE_NODE_3:
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntryList[2]);
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
			case NodeMapper.MAP_OBJECT_ARRAY:
				this.debug("mapSource MAP_OBJECT_ARRAY");
				mappedSource = this.mapSourceObjectArray(mappedSource, sourceTypeKeys, sourceData);
				break;
			case NodeMapper.MAP_OBJECT:
				this.debug("mapSource MAP_OBJECT");
				mappedSource = this.mapSourceObject(mappedSource, sourceTypeKeys, sourceData);
				break;
			case NodeMapper.MAP_VALUE_ARRAY:
				this.debug("mapSource MAP_VALUE_ARRAY");
				mappedSource = this.mapSourceValueArray(mappedSource, sourceTypeKeys, sourceData);
				break;
			case NodeMapper.MAP_VALUE:
				this.debug("mapSource MAP_VALUE");
				mappedSource = this.mapSourceValue(mappedSource, sourceTypeKeys, sourceData);
				break;
		}
		return mappedSource;
	}
	/**
	 * sprawdza czy mamy tablicę wejściowa - mappedSource jeśli nie to ją tworzymy
	 * Jeśli dane wejściwe -sourceData są tablicą to iterujemy po każdym elemencie
	 * i interesują nas tylko te elementy które są obiektami, pozostałe ignorujemy
	 * do obiektów zalicza się też array a więc tablica obiektów to też tablica tablic
	 * dla każdego elementy tworzymy nowy obiekt z kluczamy tylko takimi jak są w - sourceTypeKeys - chyba że nie ustawione wtedy
	 * bierzemy wszystkie
	 * Jeśli dane wejściowe - sourceData to obiekt to tworzymy również nowy obiekt składający się z kluczy sourceTypeKeys
	 */
	protected mapSourceObjectArray(mappedSource, sourceTypeKeys: string[], sourceData: any):Object[] {
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
				} else if (Util._.isArray(streamObj)) {
					var arr = [];
					for (var j = 0; j < streamObj.length; j++) {
						var value = streamObj[j];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(String(j)) !== -1) {
							arr.push(value);
						}
					}
					mappedSource.push(arr);
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
		return mappedSource;
	}
	/**
	 * Sprawdza czy mamy obiekt wejściowy - mappedSource - jeśli nie to go tworzymy
	 * Jeśli dane wejsćiowe to tablica to iterujemy i interesują nas elementy które są obiektami
	 * w każdym obiekcie klucze które są zgodne z sourceTypeKeys przenosimy do mappedSource- mogą się nadpisywać
	 * Jeśli dane wejściowe sourceData to obiekt to iterujemy po nim i do  mappedSource dodajemy te zgodne z sourceTypeKeys
	 */
	protected mapSourceObject(mappedSource, sourceTypeKeys: string[], sourceData: any):Object {
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
				} else if (Util._.isArray(streamObj)) {
					var arr = [];
					for (var j = 0; j < streamObj.length; j++) {
						var value = streamObj[j];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(String(j)) !== -1) {
							mappedSource[String(j)] = value;
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
		return mappedSource;
	}
	/**
	 * sprawdza czy mamy tablicę wejsiową - mappedSource - jeśli nie to ją tworzymy
	 * Jeśli dane wejściowe są tablicą to sprawdzamy czy to tablica obiektów
	 * jeśli tak to wyciągamy z każdego obiektu wartości których klucze są zgodne z sourceTypeKeys
	 * lub w przypadku nie ustawienia wszystkie wartości i wrzucamy do tablicy wejściowej
	 * Jeśli w tablicy nie ma obiektu tylko number, string boolean lub data to też zapisujemy w tablicy
	 * Jeśli dane wejściowe to obiekt to wyciągamy wartości których klucze są zgodne z sourceTypeKeys
	 * Jeśli dane wejściowe to tylko number, string boolean lub data to też zapisujemy w tablicy
	 */
	protected mapSourceValueArray(mappedSource, sourceTypeKeys: string[], sourceData: any): any[] {
		if (!mappedSource){
			mappedSource = [];
		}
		if (Util._.isArray(sourceData)) {//source jest tablicą
			for (var i = 0; i < sourceData['length']; i++) {
				var streamObj = sourceData[i];
				// if (Util._.isPlainObject(streamObj)) {
				// 	for (var key in streamObj) {
				// 		var value = streamObj[key];
				// 		if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
				// 			mappedSource.push(value);
				// 		}
				// 	}
				// } else
				if (sourceTypeKeys.length === 0){
					if (Util._.isNumber(streamObj) || Util._.isString(streamObj) || Util._.isBoolean(streamObj) || Util._.isDate(streamObj)) {
						mappedSource.push(streamObj);
					}
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
			if (sourceTypeKeys.length === 0) {
				mappedSource.push(sourceData);
			}
		}
		return mappedSource;
	}
	/**
	 * otrzymujemy pojedyńczą wartość, która może być wyciągnięta z tablicy obiektów, obiektu, tablicy czy wartości
	 */
	protected mapSourceValue(mappedSource, sourceTypeKeys: string[], sourceData: any): any {
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
		return mappedSource;
	}
}
export = NodeMapper;