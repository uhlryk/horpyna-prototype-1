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
		var updateAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.PUT, SimpleModule.ACTION_UPDATE);
		this.addAction(updateAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		updateAction.addField(idField);
		updateAction.setActionHandler((request, response, done)=>{
			this.onUpdateAction(request, response, done);
		});

		var deleteAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.DELETE, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		deleteAction.addField(idField);
		deleteAction.setActionHandler((request, response, done)=>{
			this.onDeleteAction(request, response, done);
		});
	}
	public onListAction (request, response, done){
		done();
	}
	public onDetailAction (request, response, done){
		done();
	}
	public onFormCreateAction(request:Core.ActionRequest, response: Core.ActionResponse, done) {
		var dateResponse = this.formMetaData(this.getAction(SimpleModule.ACTION_CREATE));
		dateResponse['form']['action'] = "./create";
		response.setContent(dateResponse);
		done();
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		var dateResponse = this.formMetaData(this.getAction(SimpleModule.ACTION_UPDATE));
		dateResponse['form']['action'] = "./update";
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
	private formMetaData(action:Core.Action.BaseAction):Object{
		var responseContent:Object = new Object();
		responseContent['fields'] = [];
		responseContent['form'] = new Object();
		responseContent['form']['method']="POST";
		responseContent['form']['buttonName']="send";
		var bodyFields: Core.Field[] = action.getFieldListByType(Core.Action.FieldType.BODY_FIELD);
		for(var i=0;i<bodyFields.length; i++){
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
}
export = SimpleModule;