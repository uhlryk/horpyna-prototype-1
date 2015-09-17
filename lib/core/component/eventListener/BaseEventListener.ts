import Component = require("./../Component");
import Core = require("./../../../index");
import Util = require("../../util/Util");
import Action = require("../routeComponent/module/action/Action");
import IEventListenerHandler = require("./IEventListenerHandler");
/**
 * Wywoływany by odebrać event
 */
class BaseEventListener extends Component {
	private type: string;
	private subtype:string;
	private _handler: IEventListenerHandler;
	public publicEvent:boolean;
	/**
	 * warunek określający czy eventListener ma nasłuchiwać na dany event
	 * zawiera nazwy komponentów od których wyszedł event,
	 * /mod2/mod1/akcja1
	 */
	private emiterRegExp:RegExp;
	constructor(parent: Core.Module, name:string, type: string, publicEvent?: boolean) {
		this.type = type;
		this.initDebug("event:" + this.type);
		if (publicEvent === undefined) publicEvent = false;
		this.publicEvent = publicEvent;
		// this._handler = this.eventHandler;
		super(parent, name);
	}
	public getType(): string {
		return this.type;
	}
	public setHandler(v: IEventListenerHandler) {
		this._handler = v;
	}
	public getHandler():IEventListenerHandler{
		return this._handler;
	}
	public isPublic():boolean{
		return this.publicEvent;
	}
	public setSubtype(subtype:string){
		this.subtype =subtype;
	}
	public getSubtype():string{
		return this.subtype;
	}
	public setEmiterRegexp(emiterRegExp:RegExp){
		this.emiterRegExp = emiterRegExp;
	}
	public getEmiterRegExp():RegExp{
		return this.emiterRegExp;
	}
	// protected eventHandler(request: Action.Request, response: Action.Response, done): void {
	// 	done();
	// }
}
export = BaseEventListener;