import Module = require("../../core/component/routeComponent/module/Module");
import Action = require("../../core/component/routeComponent/module/action/Action");
import Model = require("../../core/component/routeComponent/module/model/Model");
import OnStartActionEvent = require("../../core/component/event/OnStartAction");

class SimpleModule extends  Module{
	public onInit(){
		super.onInit();
		var getAction:Action = new Action(Action.GET, "list");

		this.addAction(getAction);
		var onStartActionEvent = new OnStartActionEvent.Subscriber();
		onStartActionEvent.addCallback(function(data:OnStartActionEvent.Data){
			data = <OnStartActionEvent.Data>data;

			console.log("z1");

			data.allow(false);
			console.log(data);
		});
		this.subscribe(onStartActionEvent);
		var postAction = new Action(Action.POST, "edit");
		this.addAction(postAction);
		var putAction = new Action(Action.PUT, "update");
		this.addAction(putAction);
		var deleteAction = new Action(Action.DELETE, "delete");
		this.addAction(deleteAction);
	}
}
export = SimpleModule;