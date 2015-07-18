import Module = require("./Module");
import Action = require("./action/Action");

class DefaultModule extends  Module{
	public static ACTION_FALLBACK = "fallback";
	public onConstructor(){
		super.onConstructor();
		var fallbackAction:Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_FALLBACK);
		this.addAction(fallbackAction);
		fallbackAction.addActionHandler((request, response, done) => {
			this.onFallbackAction(request, response, done);
		});
	}
	public onFallbackAction(request: Action.Request, response: Action.Response, done) {
		response.setStatus(404);
		done();
	}
}
export = DefaultModule;