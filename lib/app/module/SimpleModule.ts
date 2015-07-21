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
		var idParam: Core.Param = new Core.Param("id", Core.Action.ParamType.PARAM_URL);
		detailAction.addParam(idParam);
		detailAction.setActionHandler((request, response, done)=>{
			this.onDetailAction(request, response, done);
		});
		var updateAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.PUT, SimpleModule.ACTION_UPDATE);
		this.addAction(updateAction);
		var idParam: Core.Param = new Core.Param("id", Core.Action.ParamType.PARAM_URL);
		updateAction.addParam(idParam);
		updateAction.setActionHandler((request, response, done)=>{
			this.onUpdateAction(request, response, done);
		});

		var deleteAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.DELETE, SimpleModule.ACTION_DELETE);
		this.addAction(deleteAction);
		var idParam: Core.Param = new Core.Param("id", Core.Action.ParamType.PARAM_URL);
		deleteAction.addParam(idParam);
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
		response.setContent(this.formMetaData(this.getAction(SimpleModule.ACTION_CREATE)));
		done();
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		response.setContent(this.formMetaData(this.getAction(SimpleModule.ACTION_UPDATE)));
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
		responseContent['form']['action']="/";
		responseContent['form']['method']="POST";
		responseContent['form']['buttonName']="send";
		var bodyParams: Core.Param[] = action.getParamListByType(Core.Action.ParamType.PARAM_BODY);
		for(var i=0;i<bodyParams.length; i++){
			var param:Core.Param = bodyParams[i];
			var field:Object = new Object();
			field["param"] = param.getParam();
			field["name"] = param.getName();
			field["type"] = "text";
			responseContent['fields'].push(field);
		}
		return responseContent;
	}
}
export = SimpleModule;