/**
 * Klasa bazowa dla komponentów które mają routy. Dziedziczy po Component. Po niej dziedziczą moduły i akcje.
 * Formularze, kolumny modele dziedziczą po Component
 *
 */
import Component = require("../Component");
import Util = require("../../util/Util");

class RouteComponent extends Component{
	/**
	 * Fragment route odpowiadający temu komponentowi
	 * np jeśli komponent nazywa się list i jest w module car to
	 * _partialRoute = 'list'
	 * _baseRoute = '/car/'
	 */
	private _routeName:string;
	/**
	 * Pozwala wyłączyć dany element z budowanego routeName, na ścieżkę elementu będą się składać nad elementy i pod elementy
	 */
	private _disableRouteName: boolean;
	/**
	 * Cała ścieżka route do danego komponentu RouteComponent. Nie zawiera danego elementu
	 */
	// private _baseRoute: string;
	// private viewClass;
	constructor(name:string){
		super(name);
		this.routeName = this.name;
		this.disableRouteName = false;
	}
	/**
	 * Nadpisuje init Component i dodaje w nim pobranie baseRoute od parent
	 */
	public init(): Util.Promise<void> {
		return super.init();
	}
	public set disableRouteName(v:boolean){
		this._disableRouteName = v;
	}
	public get disableRouteName():boolean{
		return this._disableRouteName;
	}
	/**
	 * Zwraca nazwę danego członu route
	 */
	public set routeName(v: string) {
		this._routeName = this.name;
		this.checkName(this._routeName);
	}
	public get routeName(): string {
		return this._routeName;
	}
	/**
	 * Buduje pełną ścieżkę od danego elementu do najwyższego elementu ale używa routeName zamiast name
	 * @return {string}           zwraca ścieżkę np grandparentcomponent/parentcomponent/thiscomponent
	 */
	public getRoutePath():string{
		var separator = "/";
		var tempRouteName = separator + this.routeName;
		if(this.disableRouteName === true){
			tempRouteName = "";
		}
		if (this.isInit === false) {
			throw SyntaxError(Component.COMPONENT_INIT_NEED);
		}
		if (this.parent instanceof RouteComponent === false) {
			return tempRouteName;
		} else {
			return (<RouteComponent>this.parent).getRoutePath() + tempRouteName;
		}
	}
	// public setViewClass(viewClass, force?:boolean){
	// 	if(!this.viewClass || force) {
	// 		this.viewClass = viewClass;
	// 	}
	// }
	// public getViewClass(){
	// 	return this.viewClass;
	// }
	/**
	 * Na podstawie bazowego członu i nowego partiala buduje route path
	 * np mamy baseRoute = 'car/user/dummy/'
	 * i partRoute = 'list'
	 * to system zbuduje 'car/user/dummy/list'
	 * Metoda dba o wstawianie '/'
	 */
	// public static buildRoute(baseRoute: string, partRoute: string): string {
	// 	if (baseRoute.slice(-1) !== "/") {
	// 		baseRoute = baseRoute + "/";
	// 	}
	// 	if (partRoute) {
	// 		return baseRoute + partRoute + "/";
	// 	} else {
	// 		return baseRoute;
	// 	}
	// }
}
export = RouteComponent;