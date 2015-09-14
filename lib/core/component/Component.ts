import Util = require("../util/Util");
import Element = require("../Element");
import ComponentManager = require("./ComponentManager");
import Action = require("./routeComponent/module/action/Action");
/**
 * Klasa bazowa do wszystkich obiektów które są kompoentami. Nazwa jest obowiązkowa
 * ponieważ jest to wskaźnik na obiekt.
 * Nazwa może zawierać tylko a-zA-Z\- i 0-9.
 *
 */
class Component extends Element {
	public static WRONG_NAME: string = "Name can contain only a-zA-Z0-9-";
	public static EMPTY_NAME: string = "Name can't be null";
	public static WRONG_PARENT: string = "Child Component parent is wrong";
	// public static MULTIPLE_PARENT: string = "Component can have only one parent Component";
	// public static INIT_NULL_PARENT: string = "Component can init only when parent Component is set";
	// public static INIT_ALREADY: string = "Component is initialized already";
	public static COMPONENT_INIT_NEED: string = "Component must be initialized before this method";
	public static ADD_INIT_CANT: string = "Cant add element if object is initialized";
	private _name:string;
	private _id:number;
	private _parent:Component;
	public static count = 0;
	public static componentList:Component[] = [];
	private _childComponentList:Component[];
	private _componentManager: ComponentManager;
	/**
	 * wywoływane przez moduły podrzędne sprawdzające czy dany moduł
	 * nadrzędny ma tą wartość na true. Co znaczy że jest zainicjowany i podrzędne mogą się w oparciu
	 * o ten nadrzędny też zainicjować. W przeciwnym razie czekają.
	 * Czekają aż jakiś nadrzędny moduł sprawdzi że jego nadrzędny jest zainincjowany (lub że CompoenentManager się zainicjuje)
	 * i zainicjuje podrzędne.
	 */
	private _isInit: boolean;
	constructor(parent:Component, name:string){
		super();
		this._name = name;
		this.checkName(name);
		Component.componentList.push(this);
		Component.count++;
		this._id = Component.count;
		this.initDebug("component:" + this.name);
		this.debug('constructor %s a', this.name);
		this._isInit = false;
		this._childComponentList = [];
		this._parent = parent;
		this._componentManager = parent.componentManager;
		if (this._parent !== this) {
			this._parent.addChild(this);
		}
		this.onConstructor();
	}
	/**
	 * Zwraca komponent na podstawie jego unikalnego id. Od konstrukcji jest on dostępny
	 * Id jest stałe od momentu budowy aplikacji. Ponowna budowa spowoduje przydzielenie nowego id
	 */
	public static getById(id:number):Component{
		return Component.componentList[id];
	}
	public onConstructor(){}
	/**
	 * Wywoływane tylko przez child Component
	 */
	public addChild(child: Component) {
		if(child.parent !== this){
			throw SyntaxError(Component.WRONG_PARENT);
		}
		this._childComponentList.push(child);
	}
	public getChild(name:string){
		return this._childComponentList[name];
	}
	public getChildList(): Component[] {
		return this._childComponentList;
	}
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
	public setInit() {
		this._isInit = true;
	}
	public isInit() : boolean {
		return this._isInit;
	}
	/**
	 * Każdy komponent musi zostać zainicjowany.
	 * Inicjacja składa się z dwóch etapów:
	 * 1)onInit - inicjujemy logikę danego komponentu - może być pusta - wywowływana tylko za pierwszą inicjacją, drugi raz będzie pominięta
	 * 2)childInit- inicjujemy child komponenty za każdym wywołaniem sprawdza wszystkie childy
	 * jeśli parent jest tym samym modułem to nie sprawdzamy czy parent jest init
	 */
	public init(): Util.Promise<void> {
		if (this.parent === this || this.parent.isInit()) {
			if(this.isInit() === false){
				return this.onInit().then(()=>{
					return this.childInit();
				});
			} else{
				return this.childInit();
			}
		}
		return Util.Promise.resolve();
	}
	protected onInit(): Util.Promise<void> {
		this.setInit();
		return Util.Promise.resolve();
	}
	protected childInit(): Util.Promise<void> {
		return Util.Promise.map(this._childComponentList, (childComponent: Component) => {
			return childComponent.init();
		}).then(()=>{
			return;
		});
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
	public get id(): number {
		return this._id;
	}
	/**
	 * Buduje pełną ścieżkę od danego elementu do najwyższego elementu (z pominięciem ComponentManager)
	 * @param  {string} separator separator między elementami np "/" lub "_"
	 * @return {string}           zwraca ścieżkę na grandparentcomponent/parentcomponent/thiscomponent
	 */
	public getNamePath(separator: string): string {
		// if (this.isInit === false) {
		// 	throw SyntaxError(Component.COMPONENT_INIT_NEED);
		// }
		if (this.parent === this) {
			return this.name;
		} else {
			return this.parent.getNamePath(separator) + separator + this.name;
		}
	}
	/**
	 * Metoda wywoływana w każdym komponencie. Pozwala odpalić event o którym powiadomione będą inne komponenty
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
			this.callEventListeners(request, response, type, subtype, emiterPath, false, resolve);
		})
		.then(() => {
			if (this.parent !== this) {
				return this.parent.emitPublisher(request, response, type, subtype, emiterPath);
			}
		});
	}
	/**
	 * Nadpisywane przez moduł, bo w tym miejscu będziemy sprawdzać subskrpycje
	 */
	protected callEventListeners(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		done();
	}
}
export = Component;