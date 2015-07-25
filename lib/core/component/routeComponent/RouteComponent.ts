/**
 * Klasa bazowa dla komponentów które mają routy. Dziedziczy po Component. Po niej dziedziczą moduły i akcje.
 * Formularze, kolumny modele dziedziczą po Component
 *
 */
import Component = require("../Component");

class RouteComponent extends Component{
	private route:string;
	/**
	 * Cała ścieżka route do danego komponentu RouteComponent. Nie zawiera danego elementu
	 */
	private _routePath: string;
	private viewClass;
	constructor(name:string){
		super(name);
		this.route =  this.getName();
		this.checkName(this.route);
	}
	/**
	 * Zwraca nazwę danego członu route
	 */
	public setRouteName(name:string){
		this.route =  this.getName();
		this.checkName(this.route);
	}
	public set routePath(v : string) {
		this._routePath = v;
	}
	public get routePath() : string {
		return this._routePath;
	}
	public getRoute():string{
		return this.route;
	}
	public setViewClass(viewClass, force?:boolean){
		if(!this.viewClass || force) {
			this.viewClass = viewClass;
		}
	}
	public getViewClass(){
		return this.viewClass;
	}
}
export = RouteComponent;