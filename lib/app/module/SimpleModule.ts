import Core = require("../../index");

class SimpleModule extends  Core.Module{
	public static ACTION_LIST = "list";
	public static ACTION_FORM_CREATE = "createform";
	public static ACTION_FORM_UPDATE = "updateform";
	public static ACTION_FORM_DELETE = "deleteform";
	public static ACTION_DETAIL = "detail";
	public static ACTION_CREATE = "create";
	public static ACTION_UPDATE = "update";
	public static ACTION_DELETE = "delete";
	public onConstructor(){
		super.onConstructor();
		var listAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_LIST);
		this.addAction(listAction);
		/**
		 * order czyli po jakiej kolumnie sortujemy, ma po '-' kierunek sortowania ASC, DESC
		 * a potem po przecinku więcej kolumn czyli
		 * order=col1-desc,col2-asc,col3-desc
		 */
		var orderField: Core.Field = new Core.Field("order", Core.Action.FieldType.QUERY_FIELD);
		orderField.optional = true;
		listAction.addField(orderField);
		var pageField: Core.Field = new Core.Field("page", Core.Action.FieldType.QUERY_FIELD);
		pageField.optional = true;
		listAction.addField(pageField);
		var sizeField: Core.Field = new Core.Field("size", Core.Action.FieldType.QUERY_FIELD);
		sizeField.optional = true;
		listAction.addField(sizeField);
		listAction.setActionHandler((request, response, done)=>{
			this.onListAction(request, response, done);
		});
		var createAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, SimpleModule.ACTION_CREATE);
		this.addAction(createAction);
		createAction.setActionHandler((request, response, done)=>{
			this.onCreateAction(request, response, done);
		});
		var formCreateAction = new Core.Action.FormAction(createAction, SimpleModule.ACTION_FORM_CREATE);
		this.addAction(formCreateAction);
		formCreateAction.setActionHandler((request, response, done)=>{
			this.onFormCreateAction(request, response, done);
		});
		var detailAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_DETAIL);
		this.addAction(detailAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		detailAction.addField(idField);
		detailAction.setActionHandler((request, response, done)=>{
			this.onDetailAction(request, response, done);
		});
		var updateAction: Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, SimpleModule.ACTION_UPDATE);
		this.addAction(updateAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		updateAction.addField(idField);
		updateAction.setActionHandler((request, response, done)=>{
			this.onUpdateAction(request, response, done);
		});
		var formUpdateAction = new Core.Action.FormAction(updateAction, SimpleModule.ACTION_FORM_UPDATE);
		this.addAction(formUpdateAction);
		formUpdateAction.setActionHandler((request, response, done) => {
			this.onFormUpdateAction(request, response, done);
		});
		var deleteAction: Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		deleteAction.addField(idField);
		deleteAction.setActionHandler((request, response, done)=>{
			this.onDeleteAction(request, response, done);
		});
		var formDeleteAction = new Core.Action.FormAction(deleteAction, SimpleModule.ACTION_FORM_DELETE);
		this.addAction(formDeleteAction);
		formDeleteAction.setActionHandler((request, response, done) => {
			this.onFormDeleteAction(request, response, done);
		});
		var navigationEvent = new Core.Event.Action.OnFinish();
		navigationEvent.addCallback((request: Core.Action.Request, response: Core.Action.Response, done) => {
			this.onBuildNavigation(request, response, done);
		});
		this.subscribe(navigationEvent);
	}

	public onListAction (request, response, done){
		done();
	}
	public onDetailAction (request, response, done){
		done();
	}
	public onFormCreateAction(request:Core.ActionRequest, response: Core.ActionResponse, done) {
		done();
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		done();
	}
	public onFormDeleteAction(request: Core.ActionRequest, response: Core.ActionResponse, done) {
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
	/**
	 * Callback na event navigationEvent
	 * Odpala się dla wszystkich akcji tego modułu.
	 * Dodaje blok nawigacyjny po akcjach tego modułu
	 */
	private onBuildNavigation(request: Core.Action.Request, response: Core.Action.Response, done) {
		var responseContent: Object = new Object();
		responseContent['links'] = [];
		var actionList = this.getActionList();
		var actionListLength = actionList.length;
		for (var i = 0; i < actionListLength; i++) {
			var action: Core.Action.BaseAction = actionList[i];
			/**
			 * Prezentujemy akcje które są dostępne przez GET
			 */
			if(action.getMethod() !== Core.Action.BaseAction.GET){
				continue;
			}
			/**
			 * Jeśli są akcje które mają PARAM_FIELD to nie są tu prezentowane (bo wymagają i tak id)
			 */
			var paramFieldList = action.getFieldListByType(Core.FieldType.PARAM_FIELD);
			if (paramFieldList.length > 0 ){
				continue;
			}
			var linkObject = {
				link: action.getRoutePath(),
				name: action.name,
				active: false
			};
			if(action.getRoutePath() === response.routePath){
				linkObject.active = true;
			}
			responseContent['links'].push(linkObject);
		}
		response.addValue("localnavigation", responseContent);
		done();
	}
}
export = SimpleModule;