import Application = require("./Application");
import Element = require("./Element");
class Bootstrap extends Element {
	private _application:Application;
	constructor(application:Application){
		super();
		this._application = application;
	}
	public get application():Application{
		return this._application;
	}
	public init(){

	}
}
export = Bootstrap;