/**
 * Klasa bazowa dla komponentów które mają routy. Dziedziczy po Component. Po niej dziedziczą moduły i akcje.
 * Formularze, kolumny modele dziedziczą po Component
 *
 */
import Component = require("../Component");

class RouteComponent extends Component{
	private route:string;
	private viewClass;
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
		return this.route;
	}
	public setViewClass(viewClass){
		this.viewClass = viewClass;
	}
	public getViewClass(){
		return this.viewClass;
	}
}
export = RouteComponent;