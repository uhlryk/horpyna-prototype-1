import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public static RESOURCE_MODEL = "model";
	public onConstructor(){
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel, true);
	}
	public onFormCreateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:()=>void)=>{
			super.onFormCreateAction(request,response,resolve);
		})
		.then(()=>{
			var content = response.getData("content");
			var validationResponse: Core.Validator.ValidationResponse = <Core.Validator.ValidationResponse>response.getData("validationError");
			if (content && content['fields'] && validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
				content["form"]["valid"] = false;
				var fieldList: Object[] = content['fields'];
				var fieldsNumber = fieldList.length;
				for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
					var validatorResponse: Core.Validator.ValidatorResponse = validationResponse.responseValidatorList[i];
					for (var j = 0; j < fieldsNumber; j++) {
						var field = fieldList[j];
						if (field["fieldName"] === validatorResponse.field){
							field["value"] = validatorResponse.value;
							field["valid"] = validatorResponse.valid;
							if (validatorResponse.valid === false) {
								field["errorList"] = field["errorList"].concat(validatorResponse.errorList);
							}
						}
					}
				}
			}
			response.addView("horpyna/jade/createFormAction");
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
			return find.run();
		})
		.then((model) => {
			if (!model) {
				var listAction = this.getAction(SimpleModule.ACTION_LIST);
				response.setRedirect(listAction.getRoutePath());
			} else {
				model = model.toJSON();
				var content = response.getData("content");
				var validationResponse: Core.Validator.ValidationResponse = <Core.Validator.ValidationResponse>response.getData("validationError");
				var fieldList: Object[] = content['fields'];
				var fieldsNumber = fieldList.length;
				if (content && fieldList && validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
					content["form"]["valid"] = false;
					for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
						var validatorResponse: Core.Validator.ValidatorResponse = validationResponse.responseValidatorList[i];
						for (var j = 0; j < fieldsNumber; j++) {
							var field = fieldList[j];
							if (field["fieldName"] === validatorResponse.field) {
								field["value"] = validatorResponse.value;
								field["valid"] = validatorResponse.valid;
								if (validatorResponse.valid === false) {
									field["errorList"] = field["errorList"].concat(validatorResponse.errorList);
								}
							}
						}
					}
				} else {
					for (var i = 0; i < fieldsNumber; i++) {
						var field = fieldList[i];
						var fieldName = field["fieldName"];
						var value = model[fieldName];
						field["value"] = value;
					}
				}
			}
			response.addView("horpyna/jade/updateFormAction");
			done();
		});
	}
	public onFormDeleteAction(request: Core.ActionRequest, response: Core.ActionResponse, done) {
		new Core.Util.Promise<void>((resolve: () => void) => {
			super.onFormDeleteAction(request, response, resolve);
		})
			.then(() => {
				var find = new Core.Query.Find();
				find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
				var paramAppList = request.getParamAppFieldList();
				find.populateWhere(paramAppList);
				return find.run();
			})
			.then((model) => {
				if (!model) {
					var listAction = this.getAction(SimpleModule.ACTION_LIST);
					response.setRedirect(listAction.getRoutePath());
				} else {
					model = model.toJSON();
					var content = response.getData("content");
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
				response.addView("horpyna/jade/deleteFormAction");
				done();
			});
	}
	public onListAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		var rawOrder = request.getField(Core.FieldType.QUERY_FIELD, 'order');
		var page = request.getField(Core.FieldType.QUERY_FIELD, 'page');
		var pageSize = request.getField(Core.FieldType.QUERY_FIELD, 'size');
		var listAction = this.getAction(SimpleModule.ACTION_LIST);
		var baseUri = Core.Util.Uri.updateQuery(listAction.getRoutePath(true), "order", rawOrder);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "page", page);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "size", pageSize);

		var list = new Core.Query.List();
		var model = this.getDefaultModel();
		var columnNameList = model.getColumnNameList();
		var order = [];
		if (rawOrder) {
			var orderList = rawOrder.split(",");
			var length = orderList.length;
			if (length > 0) {
				order = [];
				for (var i = 0; i < length; i++) {
					var elem = orderList[i].split("-");
					order.push(elem);
					elem[1] = elem[1].toUpperCase();
				}
			}
		}
		var orderLength = order.length;
		var columnLink = [];
		response.addValue("orderLink", columnLink);
		for (var i =0; i < columnNameList.length; i++){
			var columnName = columnNameList[i];
			var direction = "DESC";
			for (var j = 0; j < orderLength; j++){
				var orderElement = order[j];
				if(orderElement[0] === columnName){
					if (orderElement[1] === "DESC") {
						direction = "ASC";
					}
				}
			}
			columnLink.push({
				link: Core.Util.Uri.updateQuery(baseUri, "order", columnName + "-" + direction),
				name:columnName,
			});
		}
		list.setModel(model);
		var paramAppList = request.getParamAppFieldList();
		list.populateWhere(paramAppList);
		list.setOrder(order);
		list.run()
		.then((modelList)=>{
			var pagination = {};
			response.addValue("pagination", pagination);
			var dataLength = modelList.length;
			if (dataLength > Core.Query.List.MAX_DATA){
				pagination['maxHit'] = Core.Query.List.MAX_DATA;//oznacza że mamy więcej rekordów niż - Core.Query.List.MAX_DATA
			}
			if (page < 1) {
				page = 1;
			}
			if (page >= Core.Query.List.MAX_DATA){
				page = Core.Query.List.MAX_DATA;
			}
			if (pageSize > Core.Query.List.MAX_DATA){
				pageSize = Core.Query.List.MAX_DATA;
			}
			if(pageSize < 1) {
				pageSize = Core.Query.List.DEFAULT_PAGE_SIZE;
			}
			var maxPages = Math.ceil(dataLength / pageSize);// liczba rzeczywista stron(widok zdecyduje ile maksymalnie wyświetli)
			if (maxPages > Core.Query.List.MAX_PAGES){
				maxPages = Core.Query.List.MAX_PAGES;
			}
			pagination['pages'] = [];
			for (var i = 0; i < maxPages; i++){
				pagination['pages'].push({
					link: Core.Util.Uri.updateQuery(baseUri, "page", String(i+1)),
					name: i + 1,
					active: (i === page - 1) ? true:false
				});
			}
			var maxLoop = page * pageSize;
			if (maxLoop > dataLength){
				maxLoop = dataLength;
			}
			var responseContent = [];
			response.setContent(responseContent);
			for (var i = (page - 1) * pageSize; i < maxLoop; i++) {
				var model = modelList[i];
				var modelData = model.toJSON();
				var data = {
					element: modelData,
					navigation: this.fieldActionLink(modelData)
				};
				responseContent.push(data);
			}
			response.addView("horpyna/jade/listAction");
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
			response.addView("horpyna/jade/detailAction");
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
		var paramAppList = request.getParamAppFieldList();
		console.log(paramAppList);
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
			if(action instanceof Core.Action.DualAction){
				action = (<Core.Action.DualAction>action).formAction;
			}
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
	/**
 * rozszerza metodę simpleModule o dodawanie kolumn do defaultowego modelu
 */
	public addField(name: string, type: Core.Action.FormType, validationNameList: Object, isOptional: boolean, options?: Object) {
		options = options || {};
		super.addField(name, type, validationNameList, isOptional, options);
		var model = this.getDefaultModel();
		//na razie nie rozbudowujemy tego tak że system ma zamapowane typ forma a typy kolumn
		model.addColumn(new Core.Column.StringColumn(name, options['length'] || 50));
	}
}
export = ResourceModule;