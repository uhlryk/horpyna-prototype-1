import Event = require("./event/Event");
import Util = require("../util/Util");
import Action = require("./routeComponent/module/action/Action");
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
	protected debugger: Util.Debugger;
	public static count = 0;
	private _logger: Util.Logger;
	constructor(name:string){
		this.name = name;
		this.checkName(name);
		Component.count++;
		this.debugger = new Util.Debugger("component:"+this.name);
		this.debug('constructor %s a', this.name);
	}
	/**
	 * wywołuje to parent w fazie init i przekazuje loggera
	 */
	public set logger(logger:Util.Logger){
		this._logger = logger;
	}
	public get logger():Util.Logger{
		return this._logger;
	}
	public debug(...args: any[]){
		this.debugger.debug(args);
	}
	public init():void {
		this.onInit();
	}
	protected onInit():void{}
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
	 */
	public publish(request: Action.Request, response: Action.Response, type: string, subtype?: string): Util.Promise<void> {
		var emiterPath: string = "";
		return this.emitPublisher(request, response, type, subtype, emiterPath);
	}
		/**
	 * Metoda wysyła do kolejnych wyżej postawionych komponentów informacje o publikacji
	 */
	private emitPublisher(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string): Util.Promise<void> {
		emiterPath = "/" + this.getName() + emiterPath;
		return new Util.Promise<void>((resolve: () => void) => {
			this.callSubscribers(request, response, type, subtype, emiterPath, false, resolve);
		})
		.then(() => {
			if (this.parent) {
				return this.parent.emitPublisher(request, response, type, subtype, emiterPath);
			}
		});
	}
	/**
	 * Nadpisywane przez moduł, bo w tym miejscu będziemy sprawdzać subskrpycje
	 */
	protected callSubscribers(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		done();
	}
}
export = Component;