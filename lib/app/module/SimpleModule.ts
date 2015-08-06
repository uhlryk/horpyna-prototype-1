import Core = require("../../index");

class SimpleModule extends  Core.Module{
	public static ACTION_LIST = "list";
	public static ACTION_DETAIL = "detail";
	public static ACTION_CREATE = "create";
	public static ACTION_UPDATE = "update";
	public static ACTION_DELETE = "delete";
	public static ACTION_FILE = "file";

	private _listAction: Core.Action.BaseAction;
	private _createAction: Core.Action.DualAction;
	private _updateAction: Core.Action.DualAction;
	private _detailAction: Core.Action.BaseAction;
	private _deleteAction: Core.Action.DualAction;
	private _fileAction: Core.Action.BaseAction;

	public onConstructor(){
		super.onConstructor();
		this._listAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_LIST);
		this.addAction(this._listAction, true);
		/**
		 * order czyli po jakiej kolumnie sortujemy, ma po '-' kierunek sortowania ASC, DESC
		 * a potem po przecinku więcej kolumn czyli
		 * order=col1-desc,col2-asc,col3-desc
		 */
		var orderField: Core.Field = new Core.Field("order", Core.Action.FieldType.QUERY_FIELD);
		orderField.optional = true;
		this._listAction.addField(orderField);
		var pageField: Core.Field = new Core.Field("page", Core.Action.FieldType.QUERY_FIELD);
		pageField.optional = true;
		this._listAction.addField(pageField);
		var sizeField: Core.Field = new Core.Field("size", Core.Action.FieldType.QUERY_FIELD);
		sizeField.optional = true;
		this._listAction.addField(sizeField);
		this._listAction.setActionHandler((request, response, action) => { return this.onListAction(request, response, action); });

		this._createAction = new Core.Action.DualAction(SimpleModule.ACTION_CREATE);
		this.addAction(this._createAction);
		this._createAction.setActionHandler((request, response, action) => { return this.onCreateAction(request, response, <Core.Action.DualAction>action); });
		this._createAction.setFormActionHandler((request, response, action) => { return this.onFormCreateAction(request, response, <Core.Action.FormAction>action); });

		this._detailAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_DETAIL);
		this.addAction(this._detailAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		this._detailAction.addField(idField);
		this._detailAction.setActionHandler((request, response, action) => { return this.onDetailAction(request, response, action);});

		this._updateAction = new Core.Action.DualAction(SimpleModule.ACTION_UPDATE);
		this._updateAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(this._updateAction);
		this._updateAction.setActionHandler((request, response, action) => { return this.onUpdateAction(request, response, <Core.Action.DualAction>action); });
		this._updateAction.setFormActionHandler((request, response, action) => { return this.onFormUpdateAction(request, response, <Core.Action.FormAction>action); });

		this._deleteAction = new Core.Action.DualAction(SimpleModule.ACTION_DELETE);
		this._deleteAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(this._deleteAction);
		this._deleteAction.setActionHandler((request, response, action) => { return this.onDeleteAction(request, response, <Core.Action.DualAction>action); });
		this._deleteAction.setFormActionHandler((request, response, action) => { return this.onFormDeleteAction(request, response, <Core.Action.FormAction>action); });

		this._fileAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_FILE);
		this._fileAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this._fileAction.addField(new Core.Field("column", Core.Action.FieldType.QUERY_FIELD));
		this._fileAction.addField(new Core.Field("count", Core.Action.FieldType.QUERY_FIELD));
		this.addAction(this._fileAction);
		this._fileAction.setActionHandler((request, response, action) => { return this.onFileAction(request, response, action); });
		this._fileAction.addValue("showInNavigation", false);

		var navigationEvent = new Core.Event.Action.OnFinish();
		navigationEvent.addCallback((request: Core.Action.Request, response: Core.Action.Response, done) => {
			this.onBuildNavigation(request, response, done);
		});
		this.subscribe(navigationEvent);
	}
	public get listAction(): Core.Action.BaseAction{
		return this._listAction;
	}
	public get createAction(): Core.Action.DualAction{
		return this._createAction;
	}
	public get updateAction(): Core.Action.DualAction {
		return this._updateAction;
	}
	public get detailAction(): Core.Action.BaseAction {
		return this._detailAction;
	}
	public get deleteAction(): Core.Action.DualAction {
		return this._deleteAction;
	}
	public get fileAction(): Core.Action.BaseAction {
		return this._fileAction;
	}
	/**
	 * szybkie dodawanie nowego pola, automatycznie dodaje do do wszystkich akcji
	 */
	public addField(name:string, formInputType:string, validationNameList:Object, options?:Object){
		options = options || {};
		var optional: boolean = options['optional'] || false;
		var fieldOptions = {};
		var fieldType = Core.Action.FieldType.BODY_FIELD;
		if(formInputType === Core.Action.FormInputType.FILE){
			fieldType = Core.Action.FieldType.FILE_FIELD;
			fieldOptions['maxFiles'] = options['fieldMaxFiles'] || 1;
		}

		var createField: Core.Field = new Core.Field(name, fieldType, fieldOptions);
		createField.optional = optional;
		createField.formInputType = formInputType;
		this.createAction.addField(createField);

		var updateField: Core.Field = new Core.Field(name, fieldType, fieldOptions);
		// if (formInputType === Core.Action.FormInputType.FILE) {
		// 	updateField.optional = true;
		// } else {
			updateField.optional = optional;
		// }
		updateField.formInputType = formInputType;
		this.updateAction.addField(updateField);
		/**
		 * Jeśli mamy do czynienia z edycją formularza, gdzie dane pole jest plikiem i jest opcjonalne
		 * to tworzymy dodatkowe pole tekstowe - docelowo będzie to checkbox który pozwala oznaczyć by usunąć stary plik
		 * bez dodania nowego
		 */
		if (formInputType === Core.Action.FormInputType.FILE && optional === true) {
			var fileHelperField: Core.Field = new Core.Field(name, Core.Action.FieldType.BODY_FIELD, fieldOptions);
			fileHelperField.formInputType = Core.Action.FormInputType.CHECKBOX;
			fileHelperField.optional = true;
			this.updateAction.addField(fileHelperField);
		}


		var deleteField: Core.Field = new Core.Field(name, fieldType, fieldOptions);
		deleteField.optional = true;//to jest do formularza nie jest więc obowiązkowe
		deleteField.formInputType = formInputType;
		var deleteFormAction = this.deleteAction.formAction;
		deleteFormAction.addField(deleteField);

		for(var validationName in validationNameList){
			var data = validationNameList[validationName];
			if(data.class){
				data.params.unshift(data.name);
				var createValidator = Object.create(data.class.prototype);
				createValidator.constructor.apply(createValidator, data.params);
				createField.addValidator(createValidator);
				var updateValidator = Object.create(data.class.prototype);
				updateValidator.constructor.apply(updateValidator, data.params);
				updateField.addValidator(updateValidator);
			}
		}
	}
	public onListAction (request, response, action) { return Core.Util.Promise.resolve();}
	public onDetailAction (request, response, action) { return Core.Util.Promise.resolve();}
	public onFormCreateAction(request, response, action: Core.Action.FormAction) { return Core.Util.Promise.resolve(); }
	public onFormUpdateAction(request, response, action: Core.Action.FormAction) { return Core.Util.Promise.resolve(); }
	public onFormDeleteAction(request, response, action: Core.Action.FormAction) { return Core.Util.Promise.resolve(); }
 	public onCreateAction(request, response, action:Core.Action.DualAction) { return Core.Util.Promise.resolve(); }
	public onUpdateAction(request, response, action: Core.Action.DualAction) { return Core.Util.Promise.resolve(); }
	public onDeleteAction(request, response, action: Core.Action.DualAction) { return Core.Util.Promise.resolve(); }
	public onFileAction(request, response, action: Core.Action.BaseAction) { return Core.Util.Promise.resolve(); }
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
			 * znaczy że akcja jest POST, ale ma subakcję GET
			 */
			if(action instanceof Core.Action.DualAction){
				action = (<Core.Action.DualAction>action).formAction;
			}
			/**
			 * Prezentujemy tylko akcje które są dostępne przez GET
			 */
			if(action.getMethod() !== Core.Action.BaseAction.GET){
				continue;
			}
			/**
			 * Jeśli są akcje które mają PARAM_FIELD to nie są tu prezentowane (bo wymagają i tak id)
			 */
			var paramFieldList = action.getFieldListByType(Core.Action.FieldType.PARAM_FIELD);
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