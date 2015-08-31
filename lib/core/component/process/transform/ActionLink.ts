import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Util = require("./../../../util/Util");
import NodeData = require("./../NodeData");
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
	public getActionList(): BaseAction[] {
		return this._actionList;
	}
	/**
	 * Domyślnie nazwy linków są z nazwy akcji. Możemy jednak wybrać z źródłowych danych pole które będzie nazwą
	 * @param {string} v nazwa pola w enty object/array object
	 */
	public setNameFromEntrySource(v:string){
		this._nameFromSource = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
		this.debug(mappedEntry);
		var processResponse = [];
		for (var j = 0; j < this._actionList.length; j++) {
			if (mappedEntry.length > 0) {
				for (var i = 0; i < mappedEntry.length; i++) {
					processResponse.push(this.createUri(this._actionList[j], mappedEntry[i], data));
				}
			} else {
				processResponse.push(this.createUri(this._actionList[j], {}, data));
			}
		}
		this.debug(processResponse);
		return processResponse;
	}
	/**
	 * Wszystkie linki dodane zostaną jako jedna pozycja
	 */
	protected createUri(action: BaseAction, dataToPopulate: Object, data: NodeData): Object {
		var response = new Object();
		if (dataToPopulate) {
			response['uri'] = action.populateRoutePathWithQuery(dataToPopulate, dataToPopulate);
		} else {
			response['uri'] = action.getRoutePath(false);
		}

		if (this._nameFromSource && dataToPopulate) {
			if (dataToPopulate[this._nameFromSource]) {
				response['name'] = dataToPopulate[this._nameFromSource];
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
