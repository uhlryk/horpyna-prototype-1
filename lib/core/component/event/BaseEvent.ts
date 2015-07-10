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
	constructor(type){
		this.type = type;
	}
	public getType():string{
		return this.type;
	}
}
/**
 * Wywoływany by opublikować event
  */
export class Publisher extends BaseEvent {
	public responseObject:any;
	private rawData:any;
	constructor(type:string){
		super(type);
		this.responseObject = Response;
	}
	public setRawData(rawData:any){
		this.rawData = rawData;
	}
	public getRawData():any{
		return this.rawData;
	}
}
export interface ISubscriberCallback<T extends Data>{
	(data:T):void;
}
/**
 * Wywoływany by odebrać event
 */
export class Subscriber extends BaseEvent{
	public dataObject:any;
	private callback:ISubscriberCallback<Data>;
	public publicEvent:boolean;
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
}
/**
 * Argument callbacka Subscirbera
 */
export class Data extends BaseEvent{
	private rawData:any;
	constructor(type:string, rawData:any){
		super(type);
		this.rawData= rawData;
	}
	public setRawData(rawData:any){
		this.rawData = rawData;
	}
	public getRawData():any{
		return this.rawData;
	}
}
/**
 * Zwracane dane do obiektu publish
 */
export class Response extends BaseEvent{
	private rawData:any;
	constructor(type:string, rawData:any){
		super(type);
		this.rawData= rawData;
	}
	public getRawData():any{
		return this.rawData;
	}
}
