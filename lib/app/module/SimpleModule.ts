import Module = require("../../core/component/routeComponent/module/Module");
import Action = require("../../core/component/routeComponent/module/action/Action");

class SimpleModule extends  Module{
	public onInit(){
		super.onInit();
		var getAction = new Action(Action.GET, "list");
		this.addAction(getAction);
		var postAction = new Action(Action.POST, "edit");
		this.addAction(postAction);
		var putAction = new Action(Action.PUT, "update");
		this.addAction(putAction);
		var deleteAction = new Action(Action.DELETE, "delete");
		this.addAction(deleteAction);
	}
}
export = SimpleModule;