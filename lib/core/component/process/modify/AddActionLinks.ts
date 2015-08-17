import AddObjectElement = require("./AddObjectElement");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
class AddActionLinks extends AddObjectElement{
	private _actionBefore: BaseAction[];
	private _actionAfter: BaseAction[];
	constructor(processModel: ProcessModel) {
		super(processModel)
		this._actionBefore = [];
		this._actionAfter = [];
	}
	public addActionBeforeAll(action: BaseAction, populateList?: {type: string; key?: string[]}[]) {
		this._actionBefore.push(action);
		if (populateList && populateList.length) {
			for (var i = 0; i < populateList.length; i++) {
				var populate = populateList[i];
				this.addMapSource("before_" + action.name, populate.type, populate.key);
			}
		}
	}
	public addActionAfterAll(action: BaseAction, populateList?: { type: string; key?: string[]}[]) {
		this._actionAfter.push(action);
		if (populateList && populateList.length) {
			for (var i = 0; i < populateList.length; i++) {
				var populate = populateList[i];
				this.addMapSource("after_" + action.name, populate.type, populate.key);
			}
		}
	}
	protected checkIfAddBeforeAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return this._actionBefore.length?true:false;
	}
	protected checkIfAddAfterAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): boolean {
		return this._actionAfter.length?true:false;
	}
	/**
	 * Wszystkie linki dodane zostaną jako jedna pozycja
	 */
	protected addBeforeAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		var responseObject = new Object();
		responseObject["nav_before"] = [];
		for (var i = 0; i < this._actionBefore.length; i++){
			var action = this._actionBefore[i];
			var params = this.getMappedObject("before_" + action.name, processEntryList, request);
			if (params) {
				responseObject["nav_before"].push({ link: action.populateRoutePath(params), name: action.name});
			} else {
				responseObject["nav_before"].push({ link: action.getRoutePath(false), name: action.name });
			}
		}
		return responseObject;
	}
	/**
	 * Wszystkie linki dodane zostaną jako jedna pozycja
	 */
	protected addAfterAll(dataObject: Object, processEntryList: any[], request: Request, response: Response): Object {
		var responseObject = new Object();
		responseObject["nav_after"] = [];
		for (var i = 0; i < this._actionAfter.length; i++){
			var action = this._actionAfter[i];
			var params = this.getMappedObject("after_" + action.name, processEntryList, request);
			if (params) {
				responseObject["nav_after"].push({ link: action.populateRoutePath(params), name: action.name });
			} else {
				responseObject["nav_after"].push({ link: action.getRoutePath(false), name: action.name });
			}
		}
		return responseObject
	}
}
export = AddActionLinks;
