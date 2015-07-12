import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public static RESOURCE_MODEL = "model";
	public onConstructor(){
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel);
	}
	public onInit() {
		super.onInit();

	}
	public onListAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
	public onDetailAction (data:Core.Event.Action.OnReady.Data, done){
		done();
	}
	public onCreateAction (data:Core.Event.Action.OnReady.Data, done){
		var create = new Core.Query.Create();
		create.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		create.populate(data.getBody());
		create.run();
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