import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public onInit(){
		super.onInit();
	}
	public onListAction (data:Core.Event.Action.OnAction.Data, done){
		done();
	}
	public onDetailAction (data:Core.Event.Action.OnAction.Data, done){
		done();
	}
	public onCreateAction (data:Core.Event.Action.OnAction.Data, done){
		done();
	}
	public onUpdateAction (data:Core.Event.Action.OnAction.Data, done){
		done();
	}
	public onDeleteAction (data:Core.Event.Action.OnAction.Data, done){
		done();
	}
}
export = ResourceModule;