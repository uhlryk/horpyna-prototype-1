import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
import Util = require("./../../../util/Util");
import NodeMapper = require("./../NodeMapper");
import IProcessObject = require("./../IProcessObject");
/**
 * Tworzy listę uri na podstawie podanej akcji i danych wejściowych które zrobią populację parametrów akcji
 * Dane wejściowe mogą również wypełnić query akcji
 * Zawsze zwraca listę obiektów gdzie obiekt ma {uri:string; name:string}
 * Jeśli damy dwie akcje a źródło ma dwa obiekty to otrzymamy dla każdego obiektu i każdej akcji link, a więc wynikowo
 * będzie to tablica z 4 obiektami linków
 */
class ActionLink extends BaseNode {
	private _actionList: BaseAction[];
	private _nameFromSource: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this._actionList = [];
		this.initDebug("node:ActionLink");
	}
	public addAction(action: BaseAction) {
		this._actionList.push(action);
	}
	/**
	 * Domyślnie nazwy linków są z nazwy akcji. Możemy jednak wybrać z źródłowych danych pole które będzie nazwą
	 * @param {string} v nazwa pola w enty object/array object
	 */
	public setNameFromEntrySource(v:string){
		this._nameFromSource = v;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var entryMappedSource = this.getEntryMappedByType(processEntryList, request);
			this.debug(entryMappedSource);
			var processResponse = [];
			if (entryMappedSource) {
				if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY) {
					for (var i = 0; i < entryMappedSource.length; i++) {
						for (var j = 0; j < this._actionList.length; j++) {
							processResponse.push(this.createUri(this._actionList[j], entryMappedSource[i], processEntryList, request));
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					for (var j = 0; j < this._actionList.length; j++) {
						processResponse.push(this.createUri(this._actionList[j], entryMappedSource, processEntryList, request));
					}
				} else {
					var element = [];
					for (var j = 0; j < this._actionList.length; j++) {
						element.push(this.createUri(this._actionList[j], null, processEntryList, request));
					}
					processResponse.push(element);
				}
				this.debug(processResponse);
				resolve(processResponse);
			} else {
				this.debug("null");
				resolve(null);
			}
		});
	}
	/**
	 * Wszystkie linki dodane zostaną jako jedna pozycja
	 */
	protected createUri(action: BaseAction, dataObject: Object, processEntryList: any[], request: Request): Object {
		var response = new Object();
		if (dataObject) {
			response['uri'] = action.populateRoutePathWithQuery(dataObject, dataObject);
		} else {
			response['uri'] = action.getRoutePath(false);
		}

		if (this._nameFromSource && dataObject) {
			if (dataObject[this._nameFromSource]) {
				response['name'] = dataObject[this._nameFromSource];
			} else{//nie chcemy by nazwa była undefined więc dajemy nazwę akcji
				response['name'] = action.name;
			}
		} else {
			response['name'] = action.name;
		}
		return response;
	}
}
export = ActionLink;
