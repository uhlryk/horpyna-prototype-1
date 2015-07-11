import Event = require("./event/Event");
import Debuger = require("../util/Debuger");
/**
 * Klasa bazowa do wszystkich obiektów które są kompoentami. Nazwa jest obowiązkowa
 * ponieważ jest to wskaźnik na obiekt.
 * Nazwa może zawierać tylko a-zA-Z\- i 0-9.
 *
 */
class Component{
	public static WRONG_NAME: string = "Name can contain only a-zA-Z0-9-";
	public static EMPTY_NAME: string = "Name can't be null";
	public static MULTIPLE_PARENT: string = "Component can have only one parent Component";
	private name:string;
	private parent:Component;
	private debuger: Debuger;
	public static count = 0;
	constructor(name:string){
		this.name = name;
		this.checkName(name);
		Component.count++;
		this.debuger = new Debuger("component:"+this.name+":");
		this.debug('constructor %s a', this.name);
	}
	public debug(...args: any[]){
		this.debuger.debug(args);
	}
	/**
	 * Metoda wywoływana jest gdy dany komponent jest dodawany do struktury innego komponentu.
	 * Dodaje do komponentu referencje na parent component. Dodatkowo sprawdza czy dany komponent
	 * nie ma już parenta. Dana instancja komponentu może mieć tylko jeden parent.
	 * @param parent
	 */
	public setParent(parent:Component){
		if(this.parent){
			throw SyntaxError(Component.MULTIPLE_PARENT);
		}
		this.parent = parent;
	}
	public getParent():Component{
		return this.parent;
	}
	/**
	 * Sprawdza nadaną nazwę komponentowi. Możliwe są tylko litery, wielkie i małe.
	 * @param name
	 */
	protected checkName(name:string){
		if(!name){
			throw new SyntaxError(Component.EMPTY_NAME);
		}
		if (name.search(/[^a-zA-Z0-9\-]+/) !== -1) {
			throw new SyntaxError(Component.WRONG_NAME);
		}
	}
	public getName():string{
		return this.name;
	}

	/**
	 * Metoda wywoływana w każdym komponencie. Pozwala odpalić event o którym powiadomione będą inne komponenty
	 * Publikowany event dziedziczy po Event. Dla każdego typu eventa powinna być klasa dziedzicząca po event
	 * Dla każdego eventa mamy kilka klas funkcyjnych Publisher (do publikowania), Subscriber do określenia na jaki typ czekamy,
	 * Response z danymy od Publishera.
	 * Dane przy przesyłaniu dalej idą w najprostrszej postaci type:string, data:any a nie w formie obiektu Publisher
	 * Celem jest by odbiór danych mógł być w dowolnej formie, np przez prostrze klasy nasłuchujące a nie tylko
	 * przez ten sam wyspecjalizowany event
	 * @param publisher obiekt publishera
	 * @returns {K}
	 * TODO: response dorobić by można było odpowiedzi otrzymać w evencie, problemem jest by była spójność dziedziczonych generycznych danych
	 */
	//protected publish<T extends Event.Publisher, K extends Event.Response>(publisher:T):K{
	public publish(publisher:Event.BaseEvent.Publisher):any{
		var eventList: Array<Component> = [];
		var responseData = this.sendPublisher(publisher.getType(), publisher.getRawData(), eventList);
		var response = new publisher.responseObject(publisher.getType());
		response.setRawData(responseData);
		return response;
	}

	/**
	 * Metoda wysyła do kolejnych wyżej postawionych komponentów informacje o publikacji
	 * @param publisher
	 * @param eventList każdy kolejny wyżej komponent dodaje referencje na samego siebie do tej listy
	 * Ponieważ chcemy wiedzieć np jakiego modułu akcja została wywołana, a nie tylko wywołanie akcji
	 * @returns {K}
	 */
	private sendPublisher(type:string, data:any, eventList:Array<Component>):any{
		eventList.push(this);
		var response:any = this.onSendPublisher(data);
		if(this.parent) {
			response = this.parent.sendPublisher(type, response, eventList);
		}
		return response;
	}

	/**
	 * Nadpisywane przez moduł, bo w tym miejscu będziemy sprawdzać subskrpycje
	 * @param data
	 * @returns {any}
	 */
	protected onSendPublisher(data:any):any{
		return data;
	}
}
export = Component;