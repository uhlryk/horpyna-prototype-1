import Component = require("../../../Component");
import BaseAction = require("./BaseAction");
import FormAction = require("./FormAction");
import Util = require("./../../../../util/Util");
import Response = require("./Response");
import Request = require("./Request");
import IActionHandler = require("./IActionHandler");
/**
 * Obsługuje daną akcję i subakcję FormAction.
 * W przypadku get lub niepoprawnej walidacji POST wyświetli akcję form
 * a jeśli był post i przeszło walidację to obsłuży ActionHandler walidacji
 */
class DualAction extends BaseAction {
	private _formAction: FormAction;
	constructor(name:string){
		super(BaseAction.POST, name);
		this._formAction = new FormAction(this, name);
		this._formAction.disableRouteName = true;
		this._formAction.prepare(this);
	}
	public get formAction():FormAction{
		return this._formAction;
	}
	public init(): Util.Promise<void> {
		return super.init()
		.then(()=>{
			return this._formAction.init();
		});
	}
	public setFormActionHandler(actionHandler:IActionHandler){
		this._formAction.setActionHandler(actionHandler);
	}
	/**
	 * Obsługuje POST, jeśli jednak walidacja będzie błędna, to obsłuży subakcję FormAction
	 */
	public getRequestHandler(){
		this.debug("action:getRequestHandler()");
		return (request:Request, response:Response, next)=>{
			this.debug("DualAction.getRequestHandler:");
			return new Promise<void>((resolve:()=>void)=>{
				this.requestHandler(request, response, resolve);
			})
			.then(()=>{
				if(response.valid === true){
					this.debug("DualAction.getRequestHandler: after requestHandler finish");
					next();
				} else{
					this.debug("DualAction.getRequestHandler: after requestHandler run formAction requestHandler");
					response.allow = true;
					this._formAction.requestHandler(request, response, next);
				}
			});
		}
	}
}
export = DualAction;