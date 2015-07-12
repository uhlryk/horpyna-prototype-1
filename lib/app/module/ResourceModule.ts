import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public static RESOURCE_MODEL = "resource-model";
	public onInit(){
		super.onInit();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel);
	}
	public onListAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
	public onDetailAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
	public onCreateAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
	public onUpdateAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
	public onDeleteAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
}
export = ResourceModule;