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
		var list = new Core.Query.List();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		list.run()
		.then(function(modelList){
			console.log(modelList[0].toJSON());
			done();
		});
	}
	public onDetailAction (data:Core.Event.Action.OnReady.Data, done){
		var find = new Core.Query.Find();
		find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		find.where("id",data.getParams()['id']);
		find.run()
			.then(function(model){
				console.log(model.toJSON());
				done();
			});
	}
	public onCreateAction (data:Core.Event.Action.OnReady.Data, done){
		var create = new Core.Query.Create();
		create.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		create.populate(data.getBody());
		create.run()
		.then(function(model){
				console.log(model.toJSON());
			done();
		});
	}
	public onUpdateAction (data:Core.Event.Action.OnReady.Data, done){
		var update = new Core.Query.Update();
		update.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		update.where("id",data.getParams()['id']);
		update.populate(data.getBody());
		update.run()
			.then(function(){
				done();
			});
	}
	public onDeleteAction (data:Core.Event.Action.OnReady.Data, done){
		var list = new Core.Query.Delete();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		list.where("id",data.getParams()['id']);
		list.run()
			.then(function(){
				done();
			});
	}
}
export = ResourceModule;