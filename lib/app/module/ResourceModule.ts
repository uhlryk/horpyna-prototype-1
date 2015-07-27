import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public static RESOURCE_MODEL = "model";
	public onConstructor(){
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel);
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve: () => void) => {
			super.onFormUpdateAction(request, response, resolve);
		})
		.then(() => {
			var find = new Core.Query.Find();
			find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
			find.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
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
			done();
		});
	}
	public onListAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var list = new Core.Query.List();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
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
			done();
		});
	}
	public onDetailAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var find = new Core.Query.Find();
		find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		find.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
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
			done(model.toJSON());
		});
	}
	public onUpdateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var update = new Core.Query.Update();
		update.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		update.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
		update.populate(request.getFieldList(Core.FieldType.BODY_FIELD));
		update.run()
		.then(()=>{
			done();
		});
	}
	public onDeleteAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var list = new Core.Query.Delete();
		list.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
		list.where("id", request.getField(Core.FieldType.PARAM_FIELD, 'id'));
		list.run()
		.then(()=>{
			done();
		});
	}
	/**
	 * zwraca listę linków wygenerowanych z akcji które mają GET i parametry
	 * Zastosowanie gdy chcemy do wyświetlonych szczegółów danego pola dodać dodatkowe
	 * akcje typu updateform.
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
			// for (var j = 0; j < paramFieldListLength; j++){
			// 	var field:Core.Field = paramFieldList[j];
			// 	var modelFieldValue = data[field.getFieldName()];
			// 	if (modelFieldValue) {
			// 		actionRoute = actionRoute + "/" + modelFieldValue;
			// 	}
			// }

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