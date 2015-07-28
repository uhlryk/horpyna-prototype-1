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
	 * Cała ścieżka route do danego komponentu RouteComponent. Nie zawiera danego elementu
	 */
	// private _baseRoute: string;
	// private viewClass;
	constructor(name:string){
		super(name);
		this.routeName = this.name;
	}
	/**
	 * Nadpisuje init Component i dodaje w nim pobranie baseRoute od parent
	 */
	public init(): Util.Promise<void> {
		return super.init();
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
	 * Człony elementów do których należy dany RouteComponent
	 * @param {string} v [description]
	 */
	// public set baseRoute(v : string) {
	// 	this._baseRoute = v;
	// }
	// public get baseRoute(): string {
	// 	return this._baseRoute;
	// }
	// public get fullRoute():string{
	// 	return RouteComponent.buildRoute(this.baseRoute, this.partialRoute);
	// }
	/**
	 * Buduje pełną ścieżkę od danego elementu do najwyższego elementu ale używa routeName zamiast name
	 * @return {string}           zwraca ścieżkę np grandparentcomponent/parentcomponent/thiscomponent
	 */
	public getRoutePath():string{
		var separator = "/";
		if (this.isInit === false) {
			throw SyntaxError(Component.COMPONENT_INIT_NEED);
		}
		if (this.parent instanceof RouteComponent === false) {
			return separator + this.routeName;
		} else {
			return (<RouteComponent>this.parent).getRoutePath() + separator + this.routeName;
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