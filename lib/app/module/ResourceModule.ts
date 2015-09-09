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

		this._listAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "list");

		//order
		this._listAction.addField(new Core.Field("o", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		//direction asc | desc
		this._listAction.addField(new Core.Field("d", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		//page num
		this._listAction.addField(new Core.Field("p", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		//page size
		this._listAction.addField(new Core.Field("s", Core.Action.FieldType.QUERY_FIELD, { optional: true }));
		this.addAction(this._listAction, true);

		this._createAction = new Core.Action.DualAction("create");
		this.addAction(this._createAction);

		this.onConstructDetailAction();

		this._updateAction = new Core.Action.DualAction("update");
		this._updateAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(this._updateAction);

		this._deleteAction = new Core.Action.DualAction("delete");
		this._deleteAction.addField(new Core.Field("id", Core.Action.FieldType.PARAM_FIELD));
		this.addAction(this._deleteAction);
	}
	protected onConstructDetailAction(){
		this._detailAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "detail");
		this.addAction(this._detailAction);
		var idField: Core.Field = new Core.Field("id", Core.Action.FieldType.PARAM_FIELD);
		this._detailAction.addField(idField);
	}
	protected onConstructActionHandlers(){
		// var onFormCreate = new OnFormCreateResource("horpyna/jade/createFormAction");
		var onFormCreate = new OnFormCreateResource(this);
		this.createAction.setFormActionHandler(onFormCreate.getActionHandler());

		// var onFormUpdate = new OnFormUpdateResource(this.model, "horpyna/jade/updateFormAction", this.listAction, this.fileAction);
		var onFormUpdate = new OnFormUpdateResource(this);
		this.updateAction.setFormActionHandler(onFormUpdate.getActionHandler());
		// var onFormDelete = new OnFormDeleteResource(this.model, "horpyna/jade/deleteFormAction", this.listAction, this.fileAction);
		var onFormDelete = new OnFormDeleteResource(this);
		this.deleteAction.setFormActionHandler(onFormDelete.getActionHandler());
		var onUpdate = new OnUpdateResource(this);
		this.updateAction.setActionHandler(onUpdate.getActionHandler());


		var onFile = new OnFileResource(this);
		this.fileAction.setActionHandler(onFile.getActionHandler());
		var onDelete = new OnDeleteResource(this);
		this.deleteAction.setActionHandler(onDelete.getActionHandler());
		var onDetail = new OnDetailResource(this);
		this.detailAction.setActionHandler(onDetail.getActionHandler());
		var onList = new OnListResource(this);
		this.listAction.setActionHandler(onList.getActionHandler());
		var onCreate = new OnCreateResource(this);
		this.createAction.setActionHandler(onCreate.getActionHandler());
	}
	public get model(): Core.Model{return this._model; }
	public get listAction(): Core.Action.BaseAction{return this._listAction; }
	public get createAction(): Core.Action.DualAction{return this._createAction; }
	public get createFormAction(): Core.Action.BaseAction{ return this._createAction.formAction; }
	public get updateAction(): Core.Action.DualAction {return this._updateAction; }
	public get updateFormAction(): Core.Action.BaseAction { return this._updateAction.formAction; }
	public get detailAction(): Core.Action.BaseAction {return this._detailAction; }
	public get deleteAction(): Core.Action.DualAction {return this._deleteAction; }
	public get deleteFormAction(): Core.Action.BaseAction { return this._deleteAction.formAction; }
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
		// var deleteField: Core.Field = new Core.Field(name, fieldType, fieldOptions);
		// deleteField.optional = true;//to jest do formularza nie jest więc obowiązkowe
		// deleteField.formInputType = formInputType;
		// var deleteFormAction = this.deleteAction.formAction;
		// deleteFormAction.addField(deleteField);

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
}
export = ResourceModule;