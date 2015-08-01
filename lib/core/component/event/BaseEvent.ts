import Util = require("../../util/Util");
import Element = require("../../Element");
import Action = require("../routeComponent/module/action/Action");
import ISubscriberCallback = require("./ISubscriberCallback");

/**
 * Wywoływany by odebrać event
 */
class BaseEvent extends Element {
	private type: string;
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
		super();
		this.type = type;
		this.initDebug("event:" + this.type);
		if (publicEvent === undefined) publicEvent = false;
		this.publicEvent = publicEvent;
	}
		public getType(): string {
		return this.type;
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