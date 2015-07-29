import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public static RESOURCE_MODEL = "model";
	public onConstructor(){
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel);
	}
	public onFormCreateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:()=>void)=>{
			super.onFormCreateAction(request,response,resolve);
		})
		.then(()=>{
			response.addViewParam("view","horpyna/jade/createFormAction");
			done();
		});
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve: () => void) => {
			super.onFormUpdateAction(request, response, resolve);
		})
		.then(() => {
			var find = new Core.Query.Find();
			find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
			var paramAppList = request.getParamAppFieldList();
			find.populateWhere(paramAppList);
			// find.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
			return find.run();
		})
		.then((model) => {
			if (!model) {
				var listAction = this.getAction(SimpleModule.ACTION_LIST);
				response.setRedirect(listAction.getRoutePath());
			} else {
				model = model.toJSON();
				var content = response.getData("content");
				var updateAction = this.getAction(SimpleModule.ACTION_UPDATE);
				// content['form']['action'] = updateAction.routePath + updateAction.getRoute() + model.id;
				var fieldsNumber = content["fields"].length;
				if (fieldsNumber) {
					for (var i = 0; i < fieldsNumber; i++) {
						var field = content["fields"][i];
						var fieldName = field["fieldName"];
						var value = model[fieldName];
						field["value"] = value;
					}
				}
			}
			response.addViewParam("view", "horpyna/jade/updateFormAction");
			done();
		});
	}
	public onFormDeleteAction(request: Core.ActionRequest, response: Core.ActionResponse, done) {
		new Core.Util.Promise<void>((resolve: () => void) => {
			super.onFormDeleteAction(request, response, resolve);
		})
			.then(() => {
				response.addViewParam("view", "horpyna/jade/deleteFormAction");
				done();
			});
	}
	public onListAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var list = new Core.Query.List();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		var paramAppList = request.getParamAppFieldList();
		list.populateWhere(paramAppList);
		list.run()
		.then((modelList)=>{
			var responseContent = [];
			response.setContent(responseContent);
			for(var i = 0; i < modelList.length; i++) {
				var model = modelList[i];
				var modelData = model.toJSON();

				var data = {
					element: modelData,
					navigation: this.fieldActionLink(modelData)
				};

				responseContent.push(data);
			}
			response.addViewParam("view", "horpyna/jade/listAction");
			done();
		});
	}
	public onDetailAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var find = new Core.Query.Find();
		find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		// find.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
		var paramAppList = request.getParamAppFieldList();
		find.populateWhere(paramAppList);
		find.run()
		.then((model)=>{
			if (!model) {
				var listAction = this.getAction(SimpleModule.ACTION_LIST);
				response.setRedirect(listAction.getRoutePath());
			} else {
				var modelData = model.toJSON();

				var data = {
					element: modelData,
					navigation: this.fieldActionLink(modelData)
				};
				response.setContent(data);
			}
			response.addViewParam("view", "horpyna/jade/detailAction");
			done();
		});
	}
	public onCreateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var create = new Core.Query.Create();
		create.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		create.populate(request.getFieldList(Core.FieldType.BODY_FIELD));
		create.run()
		.then((model)=>{
			response.setContent(model.toJSON());
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
			done(model.toJSON());
		});
	}
	public onUpdateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var update = new Core.Query.Update();
		update.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		// update.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
		var paramAppList = request.getParamAppFieldList();
		update.populateWhere(paramAppList);
		update.populate(request.getFieldList(Core.FieldType.BODY_FIELD));
		update.run()
		.then(()=>{
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
			done();
		});
	}
	public onDeleteAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var deleteQuery = new Core.Query.Delete();
		deleteQuery.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		//deleteQuery.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
		var paramAppList = request.getParamAppFieldList();
		deleteQuery.populateWhere(paramAppList);
		deleteQuery.run()
		.then(()=>{
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
			done();
		});
	}
	/**
	 * zwraca listę linków wygenerowanych z akcji które mają GET i parametry
	 * Zastosowanie gdy chcemy do wyświetlonych szczegółów danego pola dodać dodatkowe
	 * akcje typu updateform.
	 * @param  {Object}   data jest to model danego wiersza który jest w toJSON()
	 * @return {Object[]}      lista linków w strukturze [{link, name}]
	 */
	private fieldActionLink(data:Object):Object[]{
		var actionList = this.getActionList();
		var actionListLength = actionList.length;
		var links:Object[] = [];
		for (var i = 0; i < actionListLength; i++) {
			var action: Core.Action.BaseAction = actionList[i];
			/**
			 * Prezentujemy akcje które są dostępne przez GET
			 */
			if (action.getMethod() !== Core.Action.BaseAction.GET) {
				continue;
			}
			var actionRoute = action.populateRoutePath(data);
			/**
			 * Jeśli są akcje które nie mają PARAM_FIELD to nie są tu prezentowane
			 * ta nawigacja dotyczy danego elementu i jego parametrów
			 */
			var paramFieldList = action.getFieldListByType(Core.FieldType.PARAM_FIELD);
			var paramFieldListLength = paramFieldList.length;
			if (paramFieldListLength === 0 ){
				continue;
			}
			var linkObject = {
				link: actionRoute,
				name: action.name,
			};
			links.push(linkObject);
		}
		return links;
	}
}
export = ResourceModule;