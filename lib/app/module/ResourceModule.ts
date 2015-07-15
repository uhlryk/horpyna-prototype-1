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
	public onListAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var list = new Core.Query.List();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		list.run()
			.then(function(modelList){
				var responseContent = [];
				response.setContent(responseContent);
				for(var i=0;i<modelList.length; i++){
					var model = modelList[i];
					responseContent.push(model.toJSON());
				}
				done();
			});
	}
	public onDetailAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		//console.log(request.getAction().getName());
		var find = new Core.Query.Find();
		find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		find.where("id",request.getParam('id'));
		find.run()
			.then(function(model){
				response.setContent(model.toJSON());
				done();
			});
	}
	public onCreateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var create = new Core.Query.Create();
		create.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		create.populate(request.getBodyList());
		create.run()
			.then(function(model){
				response.setContent(model.toJSON());
				done(model.toJSON());
			});
	}
	public onUpdateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var update = new Core.Query.Update();
		update.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		update.where("id",request.getParam('id'));
		update.populate(request.getBodyList());
		update.run()
			.then(function(){
				done();
			});
	}
	public onDeleteAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var list = new Core.Query.Delete();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		list.where("id",request.getBodyList());
		list.run()
			.then(function(){
				done();
			});
	}
}
export = ResourceModule;