import Event = require("./event/Event");
import Util = require("../util/Util");
import ComponentManager = require("./ComponentManager");
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
	public static INIT_NULL_PARENT: string = "Component can init only when parent Component is set";
	public static INIT_ALREADY: string = "Component is initialized already";
	public static COMPONENT_INIT_NEED: string = "Component must be initialized before this method";
	private _name:string;
	private _parent:Component;
	protected debugger: Util.Debugger;
	public static count = 0;
	private _logger: Util.Logger;
	private _componentManager: ComponentManager;
	/**
	 * wywoływane przez moduły podrzędne sprawdzające czy dany moduł
	 * nadrzędny ma tą wartość na true. Co znaczy że jest zainicjowany i podrzędne mogą się w oparciu
	 * o ten nadrzędny też zainicjować. W przeciwnym razie czekają.
	 * Czekają aż jakiś nadrzędny moduł sprawdzi że jego nadrzędny jest zainincjowany (lub że CompoenentManager się zainicjuje)
	 * i zainicjuje podrzędne.
	 */
	private _isInit: boolean;
	constructor(name:string){
		this._name = name;
		this.checkName(name);
		Component.count++;
		this.debugger = new Util.Debugger("component:"+this.name);
		this.debug('constructor %s a', this.name);
		this._componentManager = null;
		this.isInit = false;
		this.onConstructor();
	}
	public onConstructor(){}
		/**
	 * Każdy komponent ma refenercję Na component root czyli ComponentManager
	 * @param {ComponentManager} v pierwszy komponent
	 */
	public set componentManager(v: ComponentManager) {
		this._componentManager = v;
	}
	public get componentManager() : ComponentManager {
		return this._componentManager;
	}
	public set isInit(v : boolean) {
		if (this.isInit === true) {
			throw SyntaxError(Component.INIT_ALREADY);
		}
		this._isInit = v;
	}
	public get isInit() : boolean {
		return this._isInit;
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
	/**
	 * Komponent się sam inicjuje gdy rodzic wywoła setParent i gdy rodzic jest zainicjowany
	 * Komponent jest inicjowany przez rodzica gdy tamten ma swoją inicjację
	 * Komponent w init się inicjuje i inicjuje swoje podrzędne komponenty
	 */
	public init():void {
		/**
		 * Brak rodzica przy inicjacji to błąd. komponent może być inicjowany tylko względem rodzica
		 * A wiec zainicjowany komponent zawsze ma rodzica
		 */
		if(!this.parent){
			throw SyntaxError(Component.INIT_NULL_PARENT);
		}
		this.isInit = true;
		this.logger = this.parent.logger;
		this.componentManager = this.parent.componentManager;
		// this.onInit();
	}
	// protected onInit():void{}
	/**
	 * Metoda wywoływana jest gdy dany komponent jest dodawany do struktury innego komponentu.
	 * Dodaje do komponentu referencje na parent component. Dodatkowo sprawdza czy dany komponent
	 * nie ma już parenta. Dana instancja komponentu może mieć tylko jeden parent.
	 * @param parent
	 */
	public set parent(v:Component){
		if(this._parent){
			throw SyntaxError(Component.MULTIPLE_PARENT);
		}
		this._parent = v;
		/**
		 * znaczy że rodzic jest już zainicjowany, więc może się ten moduł sam zainicjować
		 */
		if(this.parent.isInit === true){
			this.init();
		}
	}
	public get parent():Component{
		return this._parent;
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
	public get name():string{
		return this._name;
	}
	/**
	 * Buduje pełną ścieżkę od danego elementu do najwyższego elementu (z pominięciem ComponentManager)
	 * @param  {string} separator separator między elementami np "/" lub "_"
	 * @return {string}           zwraca ścieżkę na grandparentcomponent/parentcomponent/thiscomponent
	 */
	public getPathName(separator:string):string{
		if (this.isInit === false) {
			throw SyntaxError(Component.COMPONENT_INIT_NEED);
		}
		if (this.parent === this.componentManager) {
			return this.name;
		} else {
			return this.parent.getPathName(separator) + separator + this.name;
		}
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
		emiterPath = "/" + this.name + emiterPath;
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