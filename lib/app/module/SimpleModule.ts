import Core = require("../../index");

class SimpleModule extends  Core.Module{
	public static ACTION_LIST = "list";
	public static ACTION_FORM_CREATE = "createform";
	public static ACTION_FORM_UPDATE = "updateform";
	public static ACTION_DETAIL = "detail";
	public static ACTION_CREATE = "create";
	public static ACTION_UPDATE = "update";
	public static ACTION_DELETE = "delete";
	public onConstructor(){
		super.onConstructor();
		var formCreateAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_FORM_CREATE);
		this.addAction(formCreateAction);
		formCreateAction.setActionHandler((request, response, done)=>{
			this.onFormCreateAction(request, response, done);
		});
		var formUpdateAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_FORM_UPDATE);
		this.addAction(formUpdateAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		formUpdateAction.addField(idField);
		formUpdateAction.setActionHandler((request, response, done)=>{
			this.onFormUpdateAction(request, response, done);
		});
		var listAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_LIST);
		this.addAction(listAction);
		listAction.setActionHandler((request, response, done)=>{
			this.onListAction(request, response, done);
		});
		var createAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, SimpleModule.ACTION_CREATE);
		this.addAction(createAction);
		createAction.setActionHandler((request, response, done)=>{
			this.onCreateAction(request, response, done);
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

		var deleteAction: Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		deleteAction.addField(idField);
		deleteAction.setActionHandler((request, response, done)=>{
			this.onDeleteAction(request, response, done);
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
		var targetAction = this.getAction(SimpleModule.ACTION_CREATE);
		var dateResponse = this.formMetaData(targetAction);

		response.setContent(dateResponse);
		done();
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		var targetAction = this.getAction(SimpleModule.ACTION_UPDATE);
		var dateResponse = this.formMetaData(targetAction);
		var id = request.getField(Core.FieldType.PARAM_FIELD, 'id');
		dateResponse['form']['action'] = Core.RouteComponent.buildRoute(targetAction.fullRoute, id);
		response.setContent(dateResponse);
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
	private formMetaData(targetAction:Core.Action.BaseAction):Object{
		var responseContent:Object = new Object();
		responseContent['fields'] = [];
		responseContent['form'] = new Object();
		responseContent['form']['action'] = targetAction.fullRoute;
		responseContent['form']['method'] = targetAction.getMethod();
		responseContent['form']['buttonName']="send";
		var bodyFields: Core.Field[] = targetAction.getFieldListByType(Core.Action.FieldType.BODY_FIELD);
		for(var i=0;i < bodyFields.length; i++){
			var field:Core.Field = bodyFields[i];
			var fieldForm:Object = new Object();
			fieldForm["fieldName"] = field.getFieldName();
			fieldForm["name"] = field.getName();
			fieldForm["fieldForm"] = field.fieldForm;
			fieldForm["labelForm"] = field.labelForm;
			fieldForm["value"] = "";
			responseContent['fields'].push(fieldForm);
		}
		return responseContent;
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
				link: action.fullRoute,
				name: action.getName(),
				active: false
			};
			if(action === request.action){
				linkObject.active = true;
			}
			responseContent['links'].push(linkObject);
		}
		response.addValue("localnavigation", responseContent);
		done();
	}
}
export = SimpleModule;