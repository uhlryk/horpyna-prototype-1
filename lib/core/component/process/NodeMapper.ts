import Request = require("./../routeComponent/module/action/Request");
import Util = require("./../../util/Util");
import Element = require("./../../Element");
import NodeMapperObjectArray = require("./NodeMapperObjectArray");
import NodeMapperObject = require("./NodeMapperObject");
import NodeMapperValueArray = require("./NodeMapperValueArray");
import NodeMapperValue = require("./NodeMapperValue");
import SourceType = require("./SourceType");
/**
 * Odpowiada za mapowanie danych source (PARAM_FIELD, QUERY_FIELD, BODY_FILED itp) na określony obiekt używany
 * w Node
 */
class NodeMapper extends Element{
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
	private _nodeMapperObjectArray: NodeMapperObjectArray;
	private _nodeMapperObject: NodeMapperObject;
	private _nodeMapperValueArray: NodeMapperValueArray;
	private _nodeMapperValue: NodeMapperValue;
	constructor() {
		super();
		this.initDebug("mapper");
		this._mapSource = new Object();
		this._mapSourceDefault = new Object();

		this._nodeMapperObjectArray = new NodeMapperObjectArray();
		this._nodeMapperObject = new NodeMapperObject();
		this._nodeMapperValueArray = new NodeMapperValueArray();
		this._nodeMapperValue = new NodeMapperValue();
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
				this.debug("sourceType " + sourceType);
				this.debug(processEntryList);
				switch(sourceType){
					case SourceType.RESPONSE_NODE:
						for (var i = 0; i < processEntryList.length; i++) {
							var processEntry = processEntryList[i];
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntry);
						}
						break;
					case SourceType.RESPONSE_NODE_1:
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntryList[0]);
						break;
					case SourceType.RESPONSE_NODE_2:
							mappedSource = this.mapSource(mappedSource, mapType, sourceTypeKeys, processEntryList[1]);
						break;
					case SourceType.RESPONSE_NODE_3:
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
				mappedSource = this._nodeMapperObjectArray.map(mappedSource, sourceTypeKeys, sourceData);
				break;
			case NodeMapper.MAP_OBJECT:
				this.debug("mapSource MAP_OBJECT");
				mappedSource = this._nodeMapperObject.map(mappedSource, sourceTypeKeys, sourceData);
				break;
			case NodeMapper.MAP_VALUE_ARRAY:
				this.debug("mapSource MAP_VALUE_ARRAY");
				mappedSource = this._nodeMapperValueArray.map(mappedSource, sourceTypeKeys, sourceData);
				break;
			case NodeMapper.MAP_VALUE:
				this.debug("mapSource MAP_VALUE");
				mappedSource = this._nodeMapperValue.map(mappedSource, sourceTypeKeys, sourceData);
				break;
		}
		this.debug("entry:");
		this.debug(sourceData);
		this.debug("key:");
		this.debug(sourceTypeKeys);
		this.debug("response:");
		this.debug(mappedSource);
		return mappedSource;
	}
}
export = NodeMapper;