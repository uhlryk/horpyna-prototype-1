import Core = require("../../index");

class SimpleModule extends  Core.Module{
	public static ACTION_LIST = "list";
	public static ACTION_DETAIL = "detail";
	public static ACTION_CREATE = "create";
	public static ACTION_UPDATE = "update";
	public static ACTION_DELETE = "delete";
	public onConstructor(){
		super.onConstructor();
		var listAction:Core.Action = new Core.Action(Core.Action.GET, SimpleModule.ACTION_LIST);
		this.addAction(listAction,true);
		listAction.addActionHandler((request, response, done)=>{
			this.onListAction(request, response, done);
		});

		var detailAction:Core.Action = new Core.Action(Core.Action.GET, SimpleModule.ACTION_DETAIL);
		this.addAction(detailAction,true);
		var idParam:Core.Param= new Core.Param("id");
		detailAction.addParam(idParam);
		detailAction.addActionHandler((request, response, done)=>{
			this.onDetailAction(request, response, done);
		});

		var createAction:Core.Action = new Core.Action(Core.Action.POST, SimpleModule.ACTION_CREATE);
		this.addAction(createAction,true);
		createAction.addActionHandler((request, response, done)=>{
			this.onCreateAction(request, response, done);
		});

		var updateAction:Core.Action = new Core.Action(Core.Action.PUT, SimpleModule.ACTION_UPDATE);
		this.addAction(updateAction,true);
		var idParam:Core.Param= new Core.Param("id");
		updateAction.addParam(idParam);
		updateAction.addActionHandler((request, response, done)=>{
			this.onUpdateAction(request, response, done);
		});

		var deleteAction:Core.Action = new Core.Action(Core.Action.DELETE, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction,true);
		var idParam:Core.Param= new Core.Param("id");
		deleteAction.addParam(idParam);
		deleteAction.addActionHandler((request, response, done)=>{
			this.onDeleteAction(request, response, done);
		});
	}
	public onListAction (request, response, done){
		done();
	}
	public onDetailAction (request, response, done){
		done();
	}
 	public onCreateAction (request, response, done){
		done();
	}
	public onUpdateAction (request, response, done){
		done();
	}
	public onDeleteAction (request, response, done){
		done();
	}
}
export = SimpleModule;