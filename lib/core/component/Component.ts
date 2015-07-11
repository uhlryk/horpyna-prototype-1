import Event = require("./event/Event");
import Util = require("../util/Util");
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
	private debuger: Util.Debuger;
	public static count = 0;
	constructor(name:string){
		this.name = name;
		this.checkName(name);
		Component.count++;
		this.debuger = new Util.Debuger("component:"+this.name+":");
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
	 */
	public publish(publisher:Event.BaseEvent.Publisher):Util.Promise<any>{
		return new Util.Promise<any>((resolve) => {
			var rawDataCopy = publisher.getRawData();
			var emiterPath: string = "/";
			return this.emitPublisher(publisher.getType(), publisher.getSubtype(), emiterPath, rawDataCopy)
			.then(()=>{
				var response = new publisher.responseObject(publisher.getType());
				response.setRawData(rawDataCopy);
				resolve(response);
			});
		});
	}

	/**
	 * Metoda wysyła do kolejnych wyżej postawionych komponentów informacje o publikacji
	 * @param publisher
	 * @param eventList każdy kolejny wyżej komponent dodaje referencje na samego siebie do tej listy.
	 * Ponieważ chcemy wiedzieć np jakiego modułu akcja została wywołana, a nie tylko wywołanie akcji.
	 * Jest to więc lista modułów przez które przechodził moduł. Jest bez sensu bo w sumie przejdzie przez wszystkie
	 * moduły.
	 * @returns {K}
	 */
	private emitPublisher(type:string, subtype:string, emiterPath:string, data:Object):Util.Promise<void>{
		emiterPath = "/" + this.getName() + emiterPath;
		return new Util.Promise<void>((resolve:() => void) => {
			this.callSubscribers(type, subtype, emiterPath, false, data, resolve);
		})
		.then(()=>{
			if (this.parent) {
				return this.parent.emitPublisher(type, subtype, emiterPath, data);
			}
		});
	}

	/**
	 * Nadpisywane przez moduł, bo w tym miejscu będziemy sprawdzać subskrpycje
	 * @param data
	 * @returns {any}
	 */
	protected callSubscribers(type:string, subtype:string, emiterPath:string, isPublic:boolean, data:Object, done):void{
		done();
	}
}
export = Component;