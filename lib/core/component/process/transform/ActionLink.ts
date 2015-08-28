import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import Util = require("./../../../util/Util");
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
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			var processResponse = [];
			for (var j = 0; j < this._actionList.length; j++) {
				if (mappedEntry.length > 0) {
					for (var i = 0; i < mappedEntry.length; i++) {
						processResponse.push(this.createUri(this._actionList[j], mappedEntry[i], processEntryList, request));
					}
				} else {
					processResponse.push(this.createUri(this._actionList[j], {}, processEntryList, request));
				}
			}
			this.debug(processResponse);
			resolve(processResponse);
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
