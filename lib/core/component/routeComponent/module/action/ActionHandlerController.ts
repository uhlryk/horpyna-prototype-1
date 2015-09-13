import IActionHandler = require("./IActionHandler");
import Response = require("./Response");
import Request = require("./Request");
import Util = require("./../../../../util/Util");
import Element = require("./../../../../Element");
/**
 * Klasa zarządza pojedyńczym ActiobHandlerem jaki dodany może być do każdej akcji
 * Do każdej akcji jako osobna instancja
 */
class ActionHandlerController extends Element{
	private _actionHandler: IActionHandler;
	constructor(){
		super();
		this.initDebug("ahc");
		this._actionHandler = this.actionHandler;
	}
	protected actionHandler(request: Request, response: Response): Util.Promise<void> {
		return Util.Promise.resolve();
	}
	public setActionHandler(v: IActionHandler) {
		this._actionHandler = v;
	}
	public getActionHandler():IActionHandler{
		return this._actionHandler;
	}
}
export = ActionHandlerController;