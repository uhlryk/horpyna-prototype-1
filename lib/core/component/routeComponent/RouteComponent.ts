/**
 * Klasa bazowa dla komponentów które mają routy. Dziedziczy po Component. Po niej dziedziczą moduły i akcje.
 * Formularze, kolumny modele dziedziczą po Component
 *
 */
import Component = require("../Component");
class RouteComponent extends Component{
	private route:string;
	/**
	 * Określa czy dana akcja jest defaultowa. Jeśli tak to nie zwraca route
	 */
	private default:boolean;
	constructor(name:string){
		super(name);
		this.route =  this.getName();
		this.checkName(this.route);
	}
	public setRouteName(name:string){
		this.route =  this.getName();
		this.checkName(this.route);
	}
	public getRoute():string{
		if(this.default){
			return "";
		} else {
			return this.route;
		}
	}
	public setDefault(isDefault:boolean){
		this.default = isDefault;
	}
}
export = RouteComponent;