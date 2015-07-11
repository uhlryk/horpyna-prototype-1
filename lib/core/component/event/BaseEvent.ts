import Debuger = require("../../util/Debuger");

/**
 * Jest to bazowy Event który może być przekazywany z wywołania eventa do nasłuchujących obiektów.
 * Obiekt który chce wywołać event, używa określonego dziedziczącego eventa lub bazwego, podając jego typ.
 * Tworzy instancję Publisher następnie dodaje go do komponentu do metody publish
 * Obiekty które chcą dostać informacje o konkretnym evencie Tworzy instancję Subscriber klasy określonego
 * eventu lub bazowego podając jego typ.
 * Eventy mogą mieć dodatkowe metody. Event nie uczestniczy w przekazywaniu informacji!!
 * To jest tylko wrapper na obie końcówki(publikacji i nasłuchu),
 * pomiędzy modułami idzie to jako prosty tekst i obiekt any
 * Gdy obiekt opublikował zdarzenie jest ono wysyłane do najbliższego modułu który publikuje go do lokalnych nasłuchów
 * Następnie wysyła go do modułu rodzica, ten podobnie publikuje go lokalnie i wysyła wyżej.
 * Az trafi na samą górę i idzie w dół do nasłuchów publicznych.
 * Każdy moduł sam przechowuje listę nasłuchujących obiektów. Tylko on posiada metodę subscribe
 *
 *
 */

/**
 * Wewnętrzna klasa zawierająca typ eventu i robiąca wspólne zachowania
 */
class BaseEvent{
	private type:string;
	private debuger: Debuger;
	constructor(type:string){
		this.type = type;
		this.debuger = new Debuger("event:"+this.type+":");
	}
	public getType():string{
		return this.type;
	}
	public debug(...args: any[]){
		this.debuger.debug(args);
	}
}
class BaseRawDataEvent extends BaseEvent {
	private rawData:Object;
	constructor(type:string){
		super(type);
		this.rawData = Object;
	}
	public setRawData(rawData:Object){
		this.rawData = rawData;
	}
	public getRawData():Object{
		return this.rawData;
	}
}
/**
 * Wywoływany by opublikować event
  */
export class Publisher extends BaseRawDataEvent {
	public responseObject:any;
	private subtype:string;
	constructor(type:string){
		super(type);
		this.responseObject = Response;
	}
	public setSubtype(subtype:string){
		this.subtype =subtype;
	}
	public getSubtype():string{
		return this.subtype;
	}
}
export interface ISubscriberCallback<T extends Data>{
	(data:T, done):void;
}
/**
 * Wywoływany by odebrać event
 */
export class Subscriber extends BaseEvent{
	public dataObject:any;
	private subtype:string;
	private callback:ISubscriberCallback<Data>;
	public publicEvent:boolean;
	/**
	 * warunek określający czy subscirber ma nasłuchiwać na dany event
	 * zawiera nazwy komponentów od których wyszedł event,
	 * /mod2/mod1/akcja1
	 */
	private emiterRegExp:RegExp;
	constructor(type:string){
		super(type);
		this.dataObject = Data;
		this.publicEvent = false;
	}
	public addCallback(callback:ISubscriberCallback<Data>){
		this.callback = callback;
	}
	public getCallback():ISubscriberCallback<Data>{
		return this.callback;
	}
	public setPublic(publicEvent?:boolean){
		if(publicEvent === undefined ) publicEvent = false;
		this.publicEvent= publicEvent;
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
/**
 * Argument callbacka Subscirbera
 */
export class Data extends BaseRawDataEvent{
	constructor(type:string){
		super(type);
	}
}
/**
 * Zwracane dane do obiektu publish
 */
export class Response extends BaseRawDataEvent{
	constructor(type:string){
		super(type);
	}
}
