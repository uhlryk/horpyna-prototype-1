/**
 * Klasa bazowa dla komponentów które mają routy. Dziedziczy po Component. Po niej dziedziczą moduły i akcje.
 * Formularze, kolumny modele dziedziczą po Component
 *
 */
import Component = require("./Component");
class RouteComponent extends Component{
	private route:string;
	constructor(name:string,options?:any){
		super(name, options);
		options = options || {};
		this.route = options.routeName || this.getName();
		this.checkName(this.route);
	}
	public getRoute():string{
		return this.route;
	}
}
export = RouteComponent;