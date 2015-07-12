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
		var onListAction = new Core.Event.Action.OnReady.Subscriber();
		onListAction.setEmiterRegexp(/\/list$/);
		onListAction.addCallback((data:Core.Event.Action.OnReady.Data, done)=>{
			this.onListAction(data, done);
		});
		this.subscribe(onListAction);

		var detailAction:Core.Action = new Core.Action(Core.Action.GET, SimpleModule.ACTION_DETAIL);
		this.addAction(detailAction,true);
		var idParam:Core.Param= new Core.Param("id");
		detailAction.addParam(idParam);
		var onDetailAction = new Core.Event.Action.OnReady.Subscriber();
		onDetailAction.setEmiterRegexp(/\/detail$/);
		onDetailAction.addCallback((data:Core.Event.Action.OnReady.Data, done)=>{
			this.onDetailAction(data, done);
		});
		this.subscribe(onDetailAction);

		var createAction:Core.Action = new Core.Action(Core.Action.POST, SimpleModule.ACTION_CREATE);
		this.addAction(createAction,true);
		var onCreateActionEvent = new Core.Event.Action.OnReady.Subscriber();
		onCreateActionEvent.setEmiterRegexp(/\/create$/);
		onCreateActionEvent.addCallback((data:Core.Event.Action.OnReady.Data, done)=>{
			this.onCreateAction(data, done);
		});
		this.subscribe(onCreateActionEvent);

		var updateAction:Core.Action = new Core.Action(Core.Action.PUT, SimpleModule.ACTION_UPDATE);
		this.addAction(updateAction,true);
		var idParam:Core.Param= new Core.Param("id");
		updateAction.addParam(idParam);
		var onUpdateAction = new Core.Event.Action.OnReady.Subscriber();
		onUpdateAction.setEmiterRegexp(/\/update$/);
		onUpdateAction.addCallback((data:Core.Event.Action.OnReady.Data, done)=>{
			this.onUpdateAction(data, done);
		});
		this.subscribe(onUpdateAction);

		var deleteAction:Core.Action = new Core.Action(Core.Action.DELETE, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction,true);
		var idParam:Core.Param= new Core.Param("id");
		deleteAction.addParam(idParam);
		var onDeleteAction = new Core.Event.Action.OnReady.Subscriber();
		onDeleteAction.setEmiterRegexp(/\/delete$/);
		onDeleteAction.addCallback((data:Core.Event.Action.OnReady.Data, done)=>{
			this.onDeleteAction(data, done);
		});
		this.subscribe(onDeleteAction);
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
export = SimpleModule;