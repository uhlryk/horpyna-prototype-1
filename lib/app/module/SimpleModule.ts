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
		onStartActionEvent.setPublic();
		onStartActionEvent.addCallback(function(data:OnStartActionEvent.Data, done){
			data.allow(true);
			done();
		});
		this.subscribe(onStartActionEvent);
		var onStartActionEvent2 = new OnStartActionEvent.Subscriber();
		onStartActionEvent2.addCallback(function(data:OnStartActionEvent.Data, done){
			data.allow(true);
			done();
		});
		this.subscribe(onStartActionEvent2);
		var postAction = new Action(Action.POST, "edit");
		this.addAction(postAction);
		var putAction = new Action(Action.PUT, "update");
		this.addAction(putAction);
		var deleteAction = new Action(Action.DELETE, "delete");
		this.addAction(deleteAction);
	}
}
export = SimpleModule;