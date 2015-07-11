import Module = require("../../core/component/routeComponent/module/Module");
import Action = require("../../core/component/routeComponent/module/action/Action");
import Param = require("../../core/component/routeComponent/module/action/param/Param");
import Model = require("../../core/component/routeComponent/module/model/Model");
import Event = require("../../core/component/event/Event");

class SimpleModule extends  Module{
	public onInit(){
		super.onInit();

		var listAction:Action = new Action(Action.GET, "list");
		this.addAction(listAction);
		var onListAction = new Event.Action.OnAction.Subscriber();
		onListAction.setEmiterRegexp(/list$/);
		onListAction.addCallback(this.onListAction);
		this.subscribe(onListAction);

		var detailAction:Action = new Action(Action.GET, "detail");
		this.addAction(detailAction);
		var idParam:Param= new Param("id");
		detailAction.addParam(idParam);
		var onDetailAction = new Event.Action.OnAction.Subscriber();
		onDetailAction.setEmiterRegexp(/detail$/);
		onDetailAction.addCallback(this.onDetailAction);
		this.subscribe(onDetailAction);

		var createAction:Action = new Action(Action.POST, "create");
		this.addAction(createAction);
		var onCreateActionEvent = new Event.Action.OnAction.Subscriber();
		onCreateActionEvent.setEmiterRegexp(/create$/);
		onCreateActionEvent.addCallback(this.onCreateAction);
		this.subscribe(onCreateActionEvent);

		var updateAction:Action = new Action(Action.PUT, "update");
		this.addAction(updateAction);
		var idParam:Param= new Param("id");
		updateAction.addParam(idParam);
		var onUpdateAction = new Event.Action.OnAction.Subscriber();
		onUpdateAction.setEmiterRegexp(/update$/);
		onUpdateAction.addCallback(this.onUpdateAction);
		this.subscribe(onUpdateAction);

		var deleteAction:Action = new Action(Action.DELETE, "delete");
		this.addAction(deleteAction);
		var idParam:Param= new Param("id");
		deleteAction.addParam(idParam);
		var onDeleteAction = new Event.Action.OnAction.Subscriber();
		onDeleteAction.setEmiterRegexp(/delete$/);
		onDeleteAction.addCallback(this.onDeleteAction);
		this.subscribe(onDeleteAction);

		var deleteAction = new Action(Action.DELETE, "delete");
		this.addAction(deleteAction);
	}
	public onListAction (data:Event.Action.OnAction.Data, done){
		done();
	}
	public onDetailAction (data:Event.Action.OnAction.Data, done){
		done();
	}
	public onCreateAction (data:Event.Action.OnAction.Data, done){
		done();
	}
	public onUpdateAction (data:Event.Action.OnAction.Data, done){
		done();
	}
	public onDeleteAction (data:Event.Action.OnAction.Data, done){
		done();
	}
}
export = SimpleModule;