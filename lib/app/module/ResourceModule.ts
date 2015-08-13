import OnListResource = require("./actionHandler/OnListResource");
import OnFileResource = require("./actionHandler/OnFileResource");
import OnFormCreateResource = require("./actionHandler/OnFormCreateResource");
import OnFormUpdateResource = require("./actionHandler/OnFormUpdateResource");
import OnFormDeleteResource = require("./actionHandler/OnFormDeleteResource");
import OnDetailResource = require("./actionHandler/OnDetailResource");
import OnCreateResource = require("./actionHandler/OnCreateResource");
import OnUpdateResource = require("./actionHandler/OnUpdateResource");
import OnDeleteResource = require("./actionHandler/OnDeleteResource");
import Core = require("../../index");

class ResourceModule extends Core.Module {
	private _model: Core.Model;
	private _listAction: Core.Action.BaseAction;
	private _createAction: Core.Action.DualAction;
	private _updateAction: Core.Action.DualAction;
	private _detailAction: Core.Action.BaseAction;
	private _deleteAction: Core.Action.DualAction;
	private _fileAction: Core.Action.BaseAction;

	public onConstructor() {
		super.onConstructor();
		this.onConstructModels();
		this.onConstructActions();
		this.onConstructActionHandlers();
		this.onConstructSubscribers();
	}
	protected onConstructModels(){
		this._model = new Core.Model("model");
		this.addModel(this._model, true);
	}
	protected onConstructActions(){
		this._fileAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "file");
		this._fileAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this._fileAction.addField(new Core.Field("column", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		this._fileAction.addField(new Core.Field("count", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		this.addAction(this._fileAction);
		this._fileAction.addValue("showInNavigation", false);
		this._listAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "list");

		this._listAction.addField(new Core.Field("order", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		this._listAction.addField(new Core.Field("page", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		this._listAction.addField(new Core.Field("size", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		this.addAction(this._listAction, true);
		this._createAction = new Core.Action.DualAction("create");
		this.addAction(this._createAction);
		this._detailAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "detail");
		this.addAction(this._detailAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		this._detailAction.addField(idField);
		this._updateAction = new Core.Action.DualAction("update");
		this._updateAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(this._updateAction);
		this._deleteAction = new Core.Action.DualAction("delete");
		this._deleteAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(this._deleteAction);
	}
	protected onConstructActionHandlers(){
		var onFile = new OnFileResource(this.model);
		this.fileAction.setActionHandler(onFile.getActionHandler());
		var onList = new OnListResource(this, this.model, "horpyna/jade/listAction", this.fileAction);
		this.listAction.setActionHandler(onList.getActionHandler());
		var onFormCreate = new OnFormCreateResource("horpyna/jade/createFormAction");
		this.createAction.setFormActionHandler(onFormCreate.getActionHandler());
		var onFormUpdate = new OnFormUpdateResource(this.model, "horpyna/jade/updateFormAction", this.listAction, this.fileAction);
		this.updateAction.setFormActionHandler(onFormUpdate.getActionHandler());
		var onFormDelete = new OnFormDeleteResource(this.model, "horpyna/jade/deleteFormAction", this.listAction, this.fileAction);
		this.deleteAction.setFormActionHandler(onFormDelete.getActionHandler());
		// var onDetail = new OnDetailResource(this, this.model, "horpyna/jade/detailAction", this.listAction, this.fileAction);
		// this.detailAction.setActionHandler(onDetail.getActionHandler());

		var detailProcessModel = new Core.Node.ProcessModel();
		this.detailAction.setActionHandler(detailProcessModel.getActionHandler());
		var findNode = new Core.Node.Db.Find(detailProcessModel);
		var ifNode = new Core.Node.Gateway.IfExist(detailProcessModel);
		var redirectNode = new Core.Node.Response.Redirect(detailProcessModel);
		var fileLinksNode = new Core.Node.Modify.FileLinks(detailProcessModel);
		var sendDataNode = new Core.Node.Response.SendData(detailProcessModel);
		findNode.setModel(this.model);
		findNode.where(Core.Action.FieldType.APP_FIELD);
		findNode.where(Core.Action.FieldType.PARAM_FIELD);
		detailProcessModel.addChildNode(findNode);
		findNode.addChildNode(ifNode);
		redirectNode.setTargetAction(this.listAction);
		ifNode.addNegativeChildNode(redirectNode);
		ifNode.addPositiveChildNode(fileLinksNode);
		fileLinksNode.setFileAction(this.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);
		fileLinksNode.addChildNode(sendDataNode);

		var onCreate = new OnCreateResource(this.model, this.listAction);
		this.createAction.setActionHandler(onCreate.getActionHandler());
		var onUpdate = new OnUpdateResource(this.model, this.listAction, this.listAction);
		this.updateAction.setActionHandler(onUpdate.getActionHandler());
		var onDelete = new OnDeleteResource(this.model, this.listAction, this.listAction);
		this.deleteAction.setActionHandler(onDelete.getActionHandler());
	}
	protected onConstructSubscribers(){
		var navigationEvent = new Core.Event.Action.OnFinish();
		navigationEvent.addCallback((request: Core.Action.Request, response: Core.Action.Response, done) => {
			this.onBuildNavigation(request, response, done);
		});
		this.subscribe(navigationEvent);
	}
	public get model(): Core.Model{return this._model; }
	public get listAction(): Core.Action.BaseAction{return this._listAction; }
	public get createAction(): Core.Action.DualAction{return this._createAction; }
	public get updateAction(): Core.Action.DualAction {return this._updateAction; }
	public get detailAction(): Core.Action.BaseAction {return this._detailAction; }
	public get deleteAction(): Core.Action.DualAction {return this._deleteAction; }
	public get fileAction(): Core.Action.BaseAction {return this._fileAction; }
	/**
 * przyśpiesza dodawanie pól body do CRUD.
 */
	public addField(name: string, formInputType: string, validationNameList: Object, options?: Object) {
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
		updateField.optional = optional;
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
		//na razie nie rozbudowujemy tego tak że system ma zamapowane typ forma a typy kolumn
		switch (formInputType){
			case Core.Action.FormInputType.FILE:
				if (options['db_file'] === true) {//znaczy że plik ma być zapisywany w bazie danych a nie na dysku
					this.model.addColumn(new Core.Column.BlobColumn(name));
				} else {
					this.model.addColumn(new Core.Column.JsonColumn(name));
				}
				break;
			default:
				this.model.addColumn(new Core.Column.StringColumn(name, options['length'] || 50));
		}
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
export = ResourceModule;