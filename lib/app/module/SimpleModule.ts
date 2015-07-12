import Module = require("../../core/component/routeComponent/module/Module");
import Action = require("../../core/component/routeComponent/module/action/Action");
import Param = require("../../core/component/routeComponent/module/action/param/Param");
import Model = require("../../core/component/routeComponent/module/model/Model");
import Event = require("../../core/component/event/Event");

class SimpleModule extends  Module{
	public static ACTION_LIST = "list";
	public static ACTION_DETAIL = "detail";
	public static ACTION_CREATE = "create";
	public static ACTION_UPDATE = "update";
	public static ACTION_DELETE = "delete";
	public onInit(){
		super.onInit();

		var listAction:Action = new Action(Action.GET, SimpleModule.ACTION_LIST);
		this.addAction(listAction);
		var onListAction = new Event.Action.OnReady.Subscriber();
		onListAction.setEmiterRegexp(/list$/);
		onListAction.addCallback(this.onListAction);
		this.subscribe(onListAction);

		var detailAction:Action = new Action(Action.GET, SimpleModule.ACTION_DETAIL);
		this.addAction(detailAction);
		var idParam:Param= new Param("id");
		detailAction.addParam(idParam);
		var onDetailAction = new Event.Action.OnReady.Subscriber();
		onDetailAction.setEmiterRegexp(/detail$/);
		onDetailAction.addCallback(this.onDetailAction);
		this.subscribe(onDetailAction);

		var createAction:Action = new Action(Action.POST, SimpleModule.ACTION_CREATE);
		this.addAction(createAction);
		var onCreateActionEvent = new Event.Action.OnReady.Subscriber();
		onCreateActionEvent.setEmiterRegexp(/create$/);
		onCreateActionEvent.addCallback(this.onCreateAction);
		this.subscribe(onCreateActionEvent);

		var updateAction:Action = new Action(Action.PUT, SimpleModule.ACTION_UPDATE);
		this.addAction(updateAction);
		var idParam:Param= new Param("id");
		updateAction.addParam(idParam);
		var onUpdateAction = new Event.Action.OnReady.Subscriber();
		onUpdateAction.setEmiterRegexp(/update$/);
		onUpdateAction.addCallback(this.onUpdateAction);
		this.subscribe(onUpdateAction);

		var deleteAction:Action = new Action(Action.DELETE, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction);
		var idParam:Param= new Param("id");
		deleteAction.addParam(idParam);
		var onDeleteAction = new Event.Action.OnReady.Subscriber();
		onDeleteAction.setEmiterRegexp(/delete$/);
		onDeleteAction.addCallback(this.onDeleteAction);
		this.subscribe(onDeleteAction);
	}
	public onListAction (data:Event.Action.OnReady.Data, done){
		done();
	}
	public onDetailAction (data:Event.Action.OnReady.Data, done){
		done();
	}
	public onCreateAction (data:Event.Action.OnReady.Data, done){
		done();
	}
	public onUpdateAction (data:Event.Action.OnReady.Data, done){
		done();
	}
	public onDeleteAction (data:Event.Action.OnReady.Data, done){
		done();
	}
}
export = SimpleModule;