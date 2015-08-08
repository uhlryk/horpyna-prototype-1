import IActionHandler = require("./../routeComponent/module/action/IActionHandler");
import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import BaseAction = require("./../routeComponent/module/action/BaseAction");
import Util = require("./../../util/Util");

import Node = require("./Node");
/**
 * Rozpoczynająca łańcuch procesów biznesowych.
 * Jest podpinana do ActionHandlera. I do niej się podpina kolejne node'y
 * Sam w sobie ma strukturę bardzo podobną do ActionHandlerController.
 * Tyle że ActionHandlerController ma w kodzie całą logikę, a ten pozwala modelować ją z mniejszych elementów.
 */
class ProcessActionHandler extends Node{
	private _actionHandler: IActionHandler;
	constructor(){
		super();
		this.initDebug("process");
		this._actionHandler = this.actionHandler;
	}
	protected actionHandler(request: Request, response: Response, action: BaseAction): Util.Promise<void> {
		return Util.Promise.resolve();
	}
	public setActionHandler(v: IActionHandler) {
		this._actionHandler = v;
	}
	public getActionHandler():IActionHandler{
		return this._actionHandler;
	}
}
export = ProcessActionHandler;