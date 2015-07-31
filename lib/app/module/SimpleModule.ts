import Core = require("../../index");

class SimpleModule extends  Core.Module{
	public static ACTION_LIST = "list";
	public static ACTION_DETAIL = "detail";
	public static ACTION_CREATE = "create";
	public static ACTION_UPDATE = "update";
	public static ACTION_DELETE = "delete";
	public onConstructor(){
		super.onConstructor();
		var listAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_LIST);
		this.addAction(listAction, true);
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
		listAction.setActionHandler((request, response) => { return this.onListAction(request, response);});

		var createAction: Core.Action.DualAction = new Core.Action.DualAction(SimpleModule.ACTION_CREATE);
		this.addAction(createAction);
		createAction.setActionHandler((request, response) => { return this.onCreateAction(request, response);});
		createAction.setFormActionHandler((request, response) => { return this.onFormCreateAction(request, response); });

		var detailAction:Core.Action.BaseAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, SimpleModule.ACTION_DETAIL);
		this.addAction(detailAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		detailAction.addField(idField);
		detailAction.setActionHandler((request, response) => { return this.onDetailAction(request, response);});

		var updateAction: Core.Action.DualAction = new Core.Action.DualAction(SimpleModule.ACTION_UPDATE);
		updateAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(updateAction);
		updateAction.setActionHandler((request, response) => { return this.onUpdateAction(request, response); });
		updateAction.setFormActionHandler((request, response) => { return this.onFormUpdateAction(request, response); });

		var deleteAction: Core.Action.DualAction = new Core.Action.DualAction(SimpleModule.ACTION_DELETE);
		deleteAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(deleteAction);
		deleteAction.setActionHandler((request, response) => { return this.onDeleteAction(request, response); });
		deleteAction.setFormActionHandler((request, response) => { return this.onFormDeleteAction(request, response); });

		var navigationEvent = new Core.Event.Action.OnFinish();
		navigationEvent.addCallback((request: Core.Action.Request, response: Core.Action.Response, done) => {
			this.onBuildNavigation(request, response, done);
		});
		this.subscribe(navigationEvent);
	}
	/**
	 * szybkie dodawanie nowego pola, automatycznie dodaje do do wszystkich akcji
	 */
	public addField(name:string, type:Core.Action.FormType, validationNameList:Object, isOptional:boolean, options?:Object){
		options = options || {};
		isOptional = false;
		var createField: Core.Field = new Core.Field(name, Core.Action.FieldType.BODY_FIELD);
		createField.optional = isOptional;
		createField.formType = type;
		var createAction = this.getAction(Core.SimpleModule.ACTION_CREATE);
		createAction.addField(createField);

		var updateField: Core.Field = new Core.Field(name, Core.Action.FieldType.BODY_FIELD);
		updateField.optional = isOptional;
		updateField.formType = type;
		var updateAction = this.getAction(Core.SimpleModule.ACTION_UPDATE);
		updateAction.addField(updateField);

		var deleteField: Core.Field = new Core.Field(name, Core.Action.FieldType.BODY_FIELD);
		deleteField.optional = true;//to jest do formularza nie jest więc obowiązkowe
		deleteField.formType = type;
		var deleteFormAction = (<Core.Action.DualAction>this.getAction(Core.SimpleModule.ACTION_DELETE)).formAction;
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
	public onListAction (request, response) { return Core.Util.Promise.resolve();}
	public onDetailAction (request, response) { return Core.Util.Promise.resolve();}
	public onFormCreateAction(request, response) { return Core.Util.Promise.resolve();}
	public onFormUpdateAction (request, response) { return Core.Util.Promise.resolve();}
	public onFormDeleteAction(request, response) { return Core.Util.Promise.resolve();}
 	public onCreateAction (request, response) { return Core.Util.Promise.resolve();}
	public onUpdateAction (request, response) { return Core.Util.Promise.resolve();}
	public onDeleteAction (request, response) { return Core.Util.Promise.resolve();}
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