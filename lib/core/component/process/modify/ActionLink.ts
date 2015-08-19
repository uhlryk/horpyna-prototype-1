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
 * Możemy wskazać osobne źródło do query akcji lub nie wypełniać (query akcji zawiera parametry opcjonalne)
 */
class ActionLink extends BaseNode {
	private _actionList: BaseAction[];
	/**
	 * Dane wejściowe wypełnią również query akcji
	 * Domyślnie nie wypełniają
	 * Możemy wskazać osobne źródło na populację Query - wtedy ten parametr jest nieużywany
	 */
	private _isEntryQueryMap: boolean;
	private _nameFromEntry: string;
	private _nameFromQuery: string;
	private _isNameFromAction: boolean;
	constructor(processModel: ProcessModel) {
		super(processModel)
		this._actionList = [];
		this._isEntryQueryMap = false;
		this._isNameFromAction = false;
		this.initDebug("node:ActionLink");
	}
	public addAction(action: BaseAction) {
		this._actionList.push(action);
	}
	public setNameFromEntrySource(v:string){
		this._nameFromEntry = v;
	}
	public setNameFromQuerySource(v: string) {
		this._nameFromQuery = v;
	}
	public setNameFromActionName() {
		this._isNameFromAction = true;
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
							processResponse.push(this.createUri(this._actionList[j], entryMappedSource, processEntryList, request));
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					for (var j = 0; j < this._actionList.length; j++) {
						processResponse.push(this.createUri(this._actionList[j], entryMappedSource, processEntryList, request));
					}
				} else {
					for (var j = 0; j < this._actionList.length; j++) {
						processResponse.push(this.createUri(this._actionList[j], null, processEntryList, request));
					}
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
			response['uri'] = action.populateRoutePath(dataObject);
		} else {
			response['uri'] = action.getRoutePath(false);
		}
		if (this._isEntryQueryMap === true){

		}
		if (this._nameFromEntry && dataObject) {
			if (dataObject[this._nameFromEntry]) {
				response['name'] = dataObject[this._nameFromEntry];
			} else{//nie chcemy by nazwa była undefined więc dajemy nazwę akcji
				response['name'] = action.name;
			}
		} else if (this._isNameFromAction){
			response['name'] = action.name;
		}
		return response;
	}
}
export = ActionLink;
