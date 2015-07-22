import Util = require("../../util/Util");
import Action = require("../routeComponent/module/action/Action");

/**
 * Wewnętrzna klasa zawierająca typ eventu i robiąca wspólne zachowania
 */
interface ISubscriberCallback {
	(request:Action.Request, response:Action.Response, done): void;
}
/**
 * Wywoływany by odebrać event
 */
class BaseEvent {
	private type: string;
	private debugger: Util.Debugger;
	private subtype:string;
	private callback: ISubscriberCallback;
	public publicEvent:boolean;
	/**
	 * warunek określający czy subscirber ma nasłuchiwać na dany event
	 * zawiera nazwy komponentów od których wyszedł event,
	 * /mod2/mod1/akcja1
	 */
	private emiterRegExp:RegExp;
	constructor(type: string, publicEvent?: boolean) {
		this.type = type;
		this.debugger = new Util.Debugger("event:" + this.type);
		if (publicEvent === undefined) publicEvent = false;
		this.publicEvent = publicEvent;
	}
		public getType(): string {
		return this.type;
	}
	public debug(...args: any[]) {
		this.debugger.debug(args);
	}
	public addCallback(callback: ISubscriberCallback) {
		this.callback = callback;
	}
	public getCallback():ISubscriberCallback{
		return this.callback;
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
}
export = BaseEvent;