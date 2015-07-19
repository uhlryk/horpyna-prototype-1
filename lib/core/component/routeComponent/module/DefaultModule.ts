import Module = require("./Module");
import Action = require("./action/Action");

class DefaultModule extends  Module{
	public static ACTION_HOME = "home";
	public static ACTION_FINAL = "final";
	public static ACTION_BEGIN = "gegin";
	public onConstructor(){
		super.onConstructor();
		var beginAction: Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_BEGIN);
		this.addAction(beginAction);
		beginAction.setActionHandler((request, response, done) => {
			this.onBeginAction(request, response, done);
		});
		var finalAction:Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_FINAL);
		this.addAction(finalAction);
		finalAction.setActionHandler((request, response, done) => {
			this.onFinalAction(request, response, done);
		});
		var homeAction:Action.BaseAction = new Action.BaseAction(Action.BaseAction.ALL, DefaultModule.ACTION_HOME);
		this.addAction(homeAction);
		homeAction.setActionHandler((request, response, done) => {
			this.onHomeAction(request, response, done);
		});
	}
	public onBeginAction(request: Action.Request, response: Action.Response, done) {
		done();
	}
	public onFinalAction(request: Action.Request, response: Action.Response, done) {
		if (response){
			if(response.getAction() === undefined){
				response.setStatus(404);
			}
		}
		done();
	}
	public onHomeAction(request: Action.Request, response: Action.Response, done) {
		response.setStatus(200);
		done();
	}
}
export = DefaultModule;