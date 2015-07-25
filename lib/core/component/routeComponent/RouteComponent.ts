/**
 * Klasa bazowa dla komponentów które mają routy. Dziedziczy po Component. Po niej dziedziczą moduły i akcje.
 * Formularze, kolumny modele dziedziczą po Component
 *
 */
import Component = require("../Component");

class RouteComponent extends Component{
	/**
	 * Fragment route odpowiadający temu komponentowi
	 * np jeśli komponent nazywa się list i jest w module car to
	 * _partialRoute = 'list'
	 * _baseRoute = '/car/'
	 */
	private _partialRoute:string;
	/**
	 * Cała ścieżka route do danego komponentu RouteComponent. Nie zawiera danego elementu
	 */
	private _baseRoute: string;
	private viewClass;
	constructor(name:string){
		super(name);
		this._partialRoute = this.getName();
		this.checkName(this._partialRoute);
	}
	/**
	 * Zwraca nazwę danego członu route
	 */
	public set partialRoute(v : string){
		this._partialRoute = this.getName();
		this.checkName(this._partialRoute);
	}
	public get partialRoute():string{
		return this._partialRoute;
	}
	public set baseRoute(v : string) {
		this._baseRoute = v;
	}
	public get baseRoute(): string {
		return this._baseRoute;
	}
	public get fullRoute():string{
		return RouteComponent.buildRoute(this.baseRoute, this.partialRoute);
	}
	public setViewClass(viewClass, force?:boolean){
		if(!this.viewClass || force) {
			this.viewClass = viewClass;
		}
	}
	public getViewClass(){
		return this.viewClass;
	}
	/**
	 * Na podstawie bazowego członu i nowego partiala buduje route path
	 * np mamy baseRoute = 'car/user/dummy/'
	 * i partRoute = 'list'
	 * to system zbuduje 'car/user/dummy/list'
	 * Metoda dba o wstawianie '/'
	 */
	public static buildRoute(baseRoute: string, partRoute: string): string {
		if (baseRoute.slice(-1) !== "/") {
			baseRoute = baseRoute + "/";
		}
		if (partRoute) {
			return baseRoute + partRoute + "/";
		} else {
			return baseRoute;
		}
	}
}
export = RouteComponent;