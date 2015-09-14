import IValidationFilterData = require("./../IValidationFilterData");
import Core = require("../../../index");
class Auth extends Core.Module {
	public onConstructor() {
		super.onConstructor();
		this.onAddEvents();
	}
	public onAddEvents(){
		var event1 = new Core.EventListener.Action.OnBegin(this, "authorizeAll");
		event1.setHandler((request, response, done) => {
			console.log("run event from auth");
			done();
		});
	}
}
export = Auth;