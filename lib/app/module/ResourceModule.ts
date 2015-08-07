import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends SimpleModule {
	public static RESOURCE_MODEL = "model";
	public onConstructor() {
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel, true);
	}
	public onFormCreateAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.FormAction) {
		return super.onFormCreateAction(request, response, action)
			.then(() => {
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
				}
				response.view = "horpyna/jade/createFormAction";
			});
	}
	public onFormUpdateAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.FormAction) {
		return super.onFormUpdateAction(request, response, action)
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
					/**
					 * HACK
					 * hack biorący listę pól plików a następnie sprawdzający czy są dla tych plików checkboxy do usunięcia pliku
					 * jeśli tak to wypełnia je właściwymi danymi
					 */
					var fileFieldList: string[] = [];
					for (var i = 0; i < fieldList.length; i++) {
						var field: Core.Action.IInputForm = fieldList[i];
						if (field.type === Core.Action.FormInputType.FILE) {
							fileFieldList.push(field.name);
						}
					}
					for (var i = 0; i < fieldList.length; i++) {
						var field: Core.Action.IInputForm = fieldList[i];
						if (field.type === Core.Action.FormInputType.CHECKBOX && fileFieldList.indexOf(field.name) !== -1) {
							field.value = "1";
							field.label = "Delete file";
						}
					}
					//KONIEC HACKA
					/**
					 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
					 */
					var uriFileAction = this.fileAction.populateRoutePath(model);
					for (var colName in model) {
						var val = model[colName];
						if (val && val.files) {
							for (var z in val.files) {
								var file = val.files[z];
								var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
								uri = Core.Util.Uri.updateQuery(uri, "count", z);
								file['uri'] = uri;
							}
						}
					}
				}
				response.view = "horpyna/jade/updateFormAction";
			});
	}
	public onFormDeleteAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.FormAction) {
		return super.onFormDeleteAction(request, response, action)
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
					/**
					 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
					 */
					var uriFileAction = this.fileAction.populateRoutePath(model);
					for (var colName in model) {
						var val = model[colName];
						if (val && val.files) {
							for (var j in val.files) {
								var file = val.files[j];
								var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
								uri = Core.Util.Uri.updateQuery(uri, "count", j);
								file['uri'] = uri;
							}
						}
					}
				}
				response.view = "horpyna/jade/deleteFormAction";
			});
	}
	public onListAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.BaseAction) {
		var rawOrder = request.getField(Core.Action.FieldType.QUERY_FIELD, 'order');
		var page = request.getField(Core.Action.FieldType.QUERY_FIELD, 'page');
		var pageSize = request.getField(Core.Action.FieldType.QUERY_FIELD, 'size');
		var listAction = this.getAction(SimpleModule.ACTION_LIST);
		var baseUri = Core.Util.Uri.updateQuery(listAction.getRoutePath(true), "order", rawOrder);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "page", page);
		baseUri = Core.Util.Uri.updateQuery(baseUri, "size", pageSize);
		return super.onListAction(request, response, action)
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
			.then((modelList) => {
				var pagination = {};
				response.addValue("pagination", pagination);
				var dataLength = modelList.length;
				if (dataLength > Core.Query.List.MAX_DATA) {
					pagination['maxHit'] = Core.Query.List.MAX_DATA;//oznacza że mamy więcej rekordów niż - Core.Query.List.MAX_DATA
				}
				if (page < 1) {
					page = 1;
				}
				if (page >= Core.Query.List.MAX_DATA) {
					page = Core.Query.List.MAX_DATA;
				}
				if (pageSize > Core.Query.List.MAX_DATA) {
					pageSize = Core.Query.List.MAX_DATA;
				}
				if (pageSize < 1) {
					pageSize = Core.Query.List.DEFAULT_PAGE_SIZE;
				}
				var maxPages = Math.ceil(dataLength / pageSize);// liczba rzeczywista stron(widok zdecyduje ile maksymalnie wyświetli)
				if (maxPages > Core.Query.List.MAX_PAGES) {
					maxPages = Core.Query.List.MAX_PAGES;
				}
				pagination['pages'] = [];
				for (var i = 0; i < maxPages; i++) {
					pagination['pages'].push({
						link: Core.Util.Uri.updateQuery(baseUri, "page", String(i + 1)),
						name: i + 1,
						active: (i === page - 1) ? true : false
					});
				}
				var maxLoop = page * pageSize;
				if (maxLoop > dataLength) {
					maxLoop = dataLength;
				}
				var responseContent = [];
				response.content = responseContent;
				for (var i = (page - 1) * pageSize; i < maxLoop; i++) {
					var model = modelList[i];
					var modelData = model.toJSON();
					/**
					 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
					 */
					var uriFileAction = this.fileAction.populateRoutePath(modelData);
					for (var colName in modelData) {
						var val = modelData[colName];
						if (val && val.files) {
							for (var j in val.files) {
								var file = val.files[j];
								var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
								uri = Core.Util.Uri.updateQuery(uri, "count", j);
								file['uri'] = uri;
							}
						}
					}

					var data = {
						element: modelData,
						navigation: this.fieldActionLink(modelData)
					};
					responseContent.push(data);
				}
				response.view = "horpyna/jade/listAction";
			});
	}
	public onDetailAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.BaseAction) {
		return super.onDetailAction(request, response, action)
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
					var modelData = model.toJSON();
					/**
					 * do każdego pliku do jego parametrów dodaje pole uri które jest linkiem na akcję obsługującą ten plik
					 */
					var uriFileAction = this.fileAction.populateRoutePath(modelData);
					for (var colName in modelData) {
						var val = modelData[colName];
						if (val && val.files) {
							for (var j in val.files) {
								var file = val.files[j];
								var uri = Core.Util.Uri.updateQuery(uriFileAction, "column", colName);
								uri = Core.Util.Uri.updateQuery(uri, "count", j);
								file['uri'] = uri;
							}
						}
					}
					var data = {
						element: modelData,
						navigation: this.fieldActionLink(modelData)
					};
					response.content = data;
				}
				response.view = "horpyna/jade/detailAction";
			});
	}
	public onCreateAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.DualAction) {
		return super.onCreateAction(request, response, action)
			.then(() => {
				var create = new Core.Query.Create();
				create.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
				create.populate(request.getFieldList(Core.Action.FieldType.BODY_FIELD));
				/**
				 * w danych o pliku zostawiamy tylko istotne informacje originalname, mimetype, size, destination, filename, path
				 */
				var fileList = request.getFieldList(Core.Action.FieldType.FILE_FIELD);
				/**
				 * w danych o pliku zostawiamy tylko istotne informacje originalname, mimetype, size, destination, filename, path
				 */
				for (var fieldName in fileList) {
					var fieldFileList = fileList[fieldName];
					if (fieldFileList) {
						for (var i = 0; i < fieldFileList.length; i++) {
							var singleFile = fieldFileList[i];
							delete singleFile['fieldname'];
							delete singleFile['encoding'];
						}
						fileList[fieldName] = { files: fieldFileList }
					}
				}
				console.log(fileList);
				create.populate(fileList);
				return create.run();
			})
			.then((model) => {
				response.content = model.toJSON();
				var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
				response.setRedirect(listAction.getRoutePath());
			});
	}
	public onUpdateAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.DualAction) {
		return super.onUpdateAction(request, response, action)
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
					var oldModelData = model.toJSON();

					var update = new Core.Query.Update();
					update.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
					var paramAppList = request.getParamAppFieldList();
					update.populateWhere(paramAppList);

					var bodyList = request.getFieldList(Core.Action.FieldType.BODY_FIELD);
					var fileList = request.getFieldList(Core.Action.FieldType.FILE_FIELD);
					/**
					 * mechanizm pozwala usuwać pliki które w edycji nie zostały dodane a dla których pole jest opcjonalne
					 */
					for (var fieldName in fileList) {
						var fieldValue = fileList[fieldName];
						//wartość jest pusta, a więc przy edycji nie została wysłana
						if (!fieldValue) {
							//sprawdzamy czy w formularzu zostało wysłane polecenie usunięcie pliku jeśli był wcześniej dodany
							var valueDeleteFile = bodyList[fieldName];
							var field: Core.Field = action.getField(Core.Action.FieldType.BODY_FIELD, fieldName);
							//jeśli valueDeleteFile = "1" to znaczy że jest polecenie usunięcia pliku
							//sprawdzamy czy pole jest opcjonalne - czyli czy może być puste przez jego usunięcie
							if (valueDeleteFile === "1" && field.optional === true) {
								//domyślnie mechanizm zastąpi plik w bazie polem null, nie musimy nic robić - potem usunąć tylko stary plik
								this.removeOldFiles(oldModelData[fieldName]);
							} else {
								//stary plik musi zostać, usuwamy wpis o tym że dany plik w bazie ma być zastąpiony nullem
								delete fileList[fieldName];
								delete bodyList[fieldName];
							}
						} else {
							this.removeOldFiles(oldModelData[fieldName]);
						}
					}
					update.populate(bodyList);
					/**
					 * w danych o pliku zostawiamy tylko istotne informacje originalname, mimetype, size, destination, filename, path
					 */
					for (var fieldName in fileList) {
						var fieldFileList = fileList[fieldName];
						if (fieldFileList) {
							for (var i = 0; i < fieldFileList.length; i++) {
								var singleFile = fieldFileList[i];
								delete singleFile['fieldname'];
								delete singleFile['encoding'];
							}
							fileList[fieldName] = { files: fieldFileList }
						}
					}
					update.populate(fileList);
					return update.run();
				}
			})
			.then(() => {
				var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
				response.setRedirect(listAction.getRoutePath());
			});
	}
	/**
	 * usuwamy asynchronicznie pliki które są w danym wierszu w danej kolumnie
	 * ale bez przejmowania się callbackiem - komplikuje kod, a nie interesuje nas moment usunięcia
	 */
	protected removeOldFiles(fileDbObjects: {files:{path: string}[]}){
		if (fileDbObjects && fileDbObjects.files) {
			for (var i = 0; i < fileDbObjects.files.length; i++){
				var file = fileDbObjects.files[i];
				this.debug("rm file " + file.path);
				Core.Util.FS.unlinkSync(file.path)
			}
		}
	}
	public onDeleteAction(request: Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.DualAction) {
		return super.onDeleteAction(request, response, action)
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
				var oldModelData = model.toJSON();
				console.log(oldModelData);
				for(var colName in oldModelData){
					var colValue = oldModelData[colName];
					if(colValue && colValue.files){
						this.removeOldFiles(colValue);
					}
				}
				// for (var i = 0; i < fieldList.length; i++){
				// 	var field: Core.Field = fieldList[i];
				// 	console.log('======');
				// 	console.log(field);
				// 	console.log(field.getFieldName());
				// 	console.log(oldModelData[field.getFieldName()]);
				// 	console.log('======');
				// 	this.removeOldFiles(oldModelData[field.getFieldName()]);
				// }
				var deleteQuery = new Core.Query.Delete();
				deleteQuery.setModel(this.getModel(ResourceModule.RESOURCE_MODEL));
				var paramAppList = request.getParamAppFieldList();
				// console.log(paramAppList);
				deleteQuery.populateWhere(paramAppList);
				return deleteQuery.run();
			}
		})
		.then(()=>{
			var listAction = this.getAction(Core.SimpleModule.ACTION_LIST);
			response.setRedirect(listAction.getRoutePath());
		});
	}
	public onFileAction (request:Core.ActionRequest, response: Core.ActionResponse, action: Core.Action.BaseAction){
		var resuorceModel: Core.Model = this.getModel(ResourceModule.RESOURCE_MODEL);
		var columnQuery = request.getField(Core.Action.FieldType.QUERY_FIELD, "column");
		var countQuery = request.getField(Core.Action.FieldType.QUERY_FIELD, "count");
		return super.onFileAction(request, response, action)
		.then(()=>{
			var find = new Core.Query.Find();
			find.setModel(resuorceModel);
			var paramAppList = request.getParamAppFieldList();
			find.populateWhere(paramAppList);
			return find.run();
		})
		.then((model)=>{
			if (!model || resuorceModel.getColumnNameList().indexOf(columnQuery) === -1) {
				response.setStatus(404);
			} else {
				var modelData = model.toJSON();
				var column = modelData[columnQuery];
				if (column && column.files && column.files[countQuery]) {
					var file = column.files[countQuery];
					if (file['path'] && file['originalname']) {
						response.setDownload(file['path'], file['originalname'], (err)=>{
							this.onFileDownload(err);
						});
					} else{
						response.setStatus(404);
					}
				} else {
					response.setStatus(404);
				}
			}
		});
						console.log("X8");
	}
	public onFileDownload(err){
		if (err) {
			this.debug("failure download file");
		// Handle error, but keep in mind the response may be partially-sent
		// so check res.headersSent
		} else {
			this.debug("success download file");
		// decrement a download credit, etc.
		}
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
	public addField(name: string, formInputType: string, validationNameList: Object, options?: Object) {
		options = options || {};
		super.addField(name, formInputType, validationNameList, options);
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