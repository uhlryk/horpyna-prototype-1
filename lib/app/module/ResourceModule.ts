import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends  SimpleModule{
	public static RESOURCE_MODEL = "model";
	public onConstructor(){
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel, true);
	}
	public onFormCreateAction (request:Core.ActionRequest, response:Core.ActionResponse){
		return super.onFormCreateAction(request,response)
		.then(()=>{
			var content = response.content;
			var form: Core.Action.IForm = content["form"];
			var fieldList: Core.Action.IInputForm[] = form.fields;
			var validationResponse: Core.Action.ValidationResponse = <Core.Action.ValidationResponse>response.getData("validationError");
			if (validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
				form.valid = false;
				for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
					var validatorResponse: Core.Validator.ValidatorResponse = validationResponse.responseValidatorList[i];
					for (var j = 0; j < fieldList.length; j++) {
						var field:Core.Action.IInputForm = fieldList[j];
						if (field.name === validatorResponse.field){
							field.value = validatorResponse.value;
							field.valid = validatorResponse.valid;
							if (validatorResponse.valid === false) {
								field.errorList = field.errorList.concat(validatorResponse.errorList);
							}
						}
					}
				}
			}
			response.view = "horpyna/jade/createFormAction";
		});
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse){
		return super.onFormUpdateAction(request, response)
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
				var content = response.content;
				var form: Core.Action.IForm = content["form"];
				var fieldList: Core.Action.IInputForm[] = form.fields;
				var validationResponse: Core.Action.ValidationResponse = <Core.Action.ValidationResponse>response.getData("validationError");
				if (validationResponse && validationResponse.valid === false && validationResponse.responseValidatorList.length > 0) {
					form.valid = false;
					for (var i = 0; i < validationResponse.responseValidatorList.length; i++) {
						var validatorResponse: Core.Validator.ValidatorResponse = validationResponse.responseValidatorList[i];
						for (var j = 0; j < fieldList.length; j++) {
							var field: Core.Action.IInputForm = fieldList[j];
							if (field.name === validatorResponse.field) {
								field.value = validatorResponse.value;
								field.valid = validatorResponse.valid;
								if (validatorResponse.valid === false) {
									field.errorList = field.errorList.concat(validatorResponse.errorList);
								}
							}
						}
					}
				} else {
					for (var i = 0; i < fieldList.length; i++) {
						var field: Core.Action.IInputForm = fieldList[i];
						var name = field.name;
						var value = model[name];
						if (value) {
							field.value = value;
						}
					}
				}
			}
			response.view = "horpyna/jade/updateFormAction";
		});
	}
	public onFormDeleteAction(request: Core.ActionRequest, response: Core.ActionResponse) {
		return super.onFormDeleteAction(request, response)
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
				var content = response.content;
				var form: Core.Action.IForm = content["form"];
				var fieldList: Core.Action.IInputForm[] = form.fields;
				for (var i = 0; i < fieldList.length; i++) {
					var field: Core.Action.IInputForm = fieldList[i];
					var name = field.name;
					var value = model[name];
					if (value) {
						field.value = value;
					}
				}
			}
			response.view = "horpyna/jade/deleteFormAction";
		});
	}
	public onListAction (request:Core.ActionRequest,response:Core.ActionResponse){
		var rawOrder = request.getField(Core.Action.FieldType.QUERY_FIELD, 'order');
		var page = request.getField(Core.Action.FieldType.QUERY_FIELD, 'page');
		var pageSize = request.getField(Core.Action.FieldType.QUERY_FIELD, 'size');
		var listAction = this.getAction(SimpleModule.ACTION_LIST);
		var baseUri = Core.Util.Uri.updateQuery(listAction.getRoutePath(true), "order", rawOrder);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "page", page);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "size", pageSize);
		return super.onListAction(request, response)
		.then(() => {
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
			for (var i = 0; i < columnNameList.length; i++) {
				var columnName = columnNameList[i];
				var direction = "DESC";
				for (var j = 0; j < orderLength; j++) {
					var orderElement = order[j];
					if (orderElement[0] === columnName) {
						if (orderElement[1] === "DESC") {
							direction = "ASC";
						}
					}
				}
				columnLink.push({
					link: Core.Util.Uri.updateQuery(baseUri, "order", columnName + "-" + direction),
					name: columnName,
				});
			}
			list.setModel(model);
			var paramAppList = request.getParamAppFieldList();
			list.populateWhere(paramAppList);
			list.setOrder(order);
			return list.run();
		})
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
			response.content = responseContent;
			for (var i = (page - 1) * pageSize; i < maxLoop; i++) {
				var model = modelList[i];
				var modelData = model.toJSON();
				var data = {
					element: modelData,
					navigation: this.fieldActionLink(modelData)
				};
				responseContent.push(data);
			}
			response.view = "horpyna/jade/listAction";
		});
	}
	public onDetailAction (request:Core.ActionRequest,response:Core.ActionResponse){
		return super.onDetailAction(request, response)
		.then(()=>{
			var find = new Core.Query.Find();
			find.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
			var paramAppList = request.getParamAppFieldList();
			find.populateWhere(paramAppList);
			return find.run();
		})
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
				response.content = data;
			}
			response.view = "horpyna/jade/detailAction";
		});
	}
	public onCreateAction (request:Core.ActionRequest,response:Core.ActionResponse){
		return super.onCreateAction(request, response)
		.then(() => {
			var create = new Core.Query.Create();
			create.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
			create.populate(request.getFieldList(Core.Action.FieldType.BODY_FIELD));
			var fileList = request.getFieldList(Core.Action.FieldType.FILE_FIELD);
			console.log(JSON.stringify(fileList));
			return create.run();
		})
		.then((model)=>{
			response.content = model.toJSON();
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
		});
	}
	public onUpdateAction (request:Core.ActionRequest,response:Core.ActionResponse){
		return super.onUpdateAction(request, response)
		.then(() => {
			var update = new Core.Query.Update();
			update.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
			var paramAppList = request.getParamAppFieldList();
			update.populateWhere(paramAppList);
			update.populate(request.getFieldList(Core.Action.FieldType.BODY_FIELD));
			return update.run();
		})
		.then(()=>{
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
		});
	}
	public onDeleteAction (request:Core.ActionRequest,response:Core.ActionResponse){
		return super.onDeleteAction(request, response)
		.then(() => {
			var deleteQuery = new Core.Query.Delete();
			deleteQuery.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
			var paramAppList = request.getParamAppFieldList();
			console.log(paramAppList);
			deleteQuery.populateWhere(paramAppList);
			return deleteQuery.run();
		})
		.then(()=>{
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
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
			var paramFieldList = action.getFieldListByType(Core.Action.FieldType.PARAM_FIELD);
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
	public addField(name: string, formInputType: string, validationNameList: Object, isOptional: boolean, options?: Object) {
		options = options || {};
		super.addField(name, formInputType, validationNameList, isOptional, options);
		var model = this.getDefaultModel();
		//na razie nie rozbudowujemy tego tak że system ma zamapowane typ forma a typy kolumn
		switch (formInputType){
			case Core.Action.FormInputType.FILE:
				if (options['db_file'] === true) {//znaczy że plik ma być zapisywany w bazie danych a nie na dysku
					model.addColumn(new Core.Column.BlobColumn(name));
				} else {
					model.addColumn(new Core.Column.JsonColumn(name));
				}
				break;
			default:
				model.addColumn(new Core.Column.StringColumn(name, options['length'] || 50));
		}
	}
}
export = ResourceModule;