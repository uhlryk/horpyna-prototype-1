import Util = require("./../../util/Util");
import ProcessModel = require("./ProcessModel");
import IProcessObject = require("./IProcessObject");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import NodeMapper = require("./NodeMapper");
/**
 * Wrappuje w obiekt wszystkie dane które idą do content i promiseContent w BaseNode.
 * Dodatkowo ma lepiej zwracane mapowanie
 */
class NodeData{
	private _nodeMapper: NodeMapper;
	private _processEntryList: any[];
	private _actionRequest: Request;
	private _actionResponse: Response;
	private _processList: IProcessObject[];
	private _promiseContent: (mapper: NodeData) => Util.Promise<any>;
	constructor(nodeMapper: NodeMapper, processEntryList: any[], actionRequest: Request, actionResponse: Response, processList: IProcessObject[]) {
		this._nodeMapper = nodeMapper;
		this._processEntryList = processEntryList;
		this._actionRequest = actionRequest;
		this._actionResponse = actionResponse;
		this._processList = processList;
	}
	public getActionResponse(): Response {
		return this._actionResponse;
	}
	public getProcessList(): IProcessObject[] {
		return this._processList;
	}
	/**
	 * Dla danego mapowania (po nazwie - name) budujemy mappedSource odpowiedź. jej forma zależy od mapType
	 * @param  {string}  name         odpowiada name w _mapSource
	 * @param  {string}  mapType  określa jak mają być zamapowane strumienie, aktualnie mamy ObjectArray, Object, PrimitiveArray, Primitive
	 * @param  {any[]}   processEntry odpowiedź z poprzedniego Node
	 * @param  {Request} request      actionRequest
	 * @return {Object}               zwraca obiekt z key:value gdzie key to string a value:any
	 */
	public getMappedSource(name: string, mapType:string): any {
		return this._nodeMapper.getMappedSource(name, mapType, this._processEntryList, this._actionRequest);
	}
	public getMappedObjectArray(name: string):Object[] {
		return this.getMappedSource(name, NodeMapper.MAP_OBJECT_ARRAY);
	}
	public getMappedObject(name: string):Object {
		return this.getMappedSource(name, NodeMapper.MAP_OBJECT);
	}
	public getMappedValueArray(name: string): any[] {
		return this.getMappedSource(name, NodeMapper.MAP_VALUE_ARRAY);
	}
	public getMappedValue(name: string): any {
		return this.getMappedSource(name, NodeMapper.MAP_VALUE);
	}
	public getMappedEntry(): Object[] {
		return this.getMappedSource("entry_source", NodeMapper.MAP_OBJECT_ARRAY);
	}
}
export = NodeData;