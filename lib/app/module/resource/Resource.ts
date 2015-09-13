import OnListResource = require("./actionHandler/OnListResource");
import OnFileResource = require("./actionHandler/OnFileResource");
import OnFormCreateResource = require("./actionHandler/OnFormCreateResource");
import OnFormUpdateResource = require("./actionHandler/OnFormUpdateResource");
import OnFormDeleteResource = require("./actionHandler/OnFormDeleteResource");
import OnDetailResource = require("./actionHandler/OnDetailResource");
import OnCreateResource = require("./actionHandler/OnCreateResource");
import OnUpdateResource = require("./actionHandler/OnUpdateResource");
import OnDeleteResource = require("./actionHandler/OnDeleteResource");
import IValidationFilterData = require("./../IValidationFilterData");
import Core = require("../../../index");

class Resource extends Core.Module {
	private _model: Core.Model;
	private _listAction: Core.Action.BaseAction;
	private _createAction: Core.Action.BaseAction;
	private _createFormAction: Core.Action.BaseAction;
	private _updateAction: Core.Action.BaseAction;
	private _updateFormAction: Core.Action.BaseAction;
	private _detailAction: Core.Action.BaseAction;
	private _deleteAction: Core.Action.BaseAction;
	private _deleteFormAction: Core.Action.BaseAction;
	private _fileAction: Core.Action.BaseAction;

	public onConstructor() {
		super.onConstructor();
		this.onConstructModels();
		this.onConstructActions();
		this.onConstructActionHandlers();
	}
	protected onConstructModels(){
		this._model = new Core.Model(this, "default");
	}
	protected onConstructActions(){
		this._fileAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.GET, "file");
		new Core.Field.BaseField(this._fileAction, "id", Core.Field.FieldType.PARAM_FIELD);
		new Core.Field.BaseField(this._fileAction, "column", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		new Core.Field.BaseField(this._fileAction, "count", Core.Field.FieldType.QUERY_FIELD, { optional: true });

		this._listAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.GET, "list");
		//order
		new Core.Field.BaseField(this._listAction, "o", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		//direction asc | desc
		new Core.Field.BaseField(this._listAction, "d", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		//page num
		new Core.Field.BaseField(this._listAction, "p", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		//page size
		new Core.Field.BaseField(this._listAction, "s", Core.Field.FieldType.QUERY_FIELD, { optional: true });

		this._createAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.POST, "create");
		this._createFormAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.GET, "create");

		this.onConstructDetailAction();

		this._updateAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.POST, "update");
		new Core.Field.BaseField(this._updateAction, "id", Core.Field.FieldType.PARAM_FIELD);
		this._updateFormAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.GET, "update");
		new Core.Field.BaseField(this._updateFormAction, "id", Core.Field.FieldType.PARAM_FIELD);

		this._deleteAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.POST, "delete");
		new Core.Field.BaseField(this._deleteAction, "id", Core.Field.FieldType.PARAM_FIELD);
		this._deleteFormAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.GET, "delete");
		new Core.Field.BaseField(this._deleteFormAction, "id", Core.Field.FieldType.PARAM_FIELD);
	}
	protected onConstructDetailAction(){
		this._detailAction = new Core.Action.BaseAction(this, Core.Action.BaseAction.GET, "detail");
		new Core.Field.BaseField(this._detailAction, "id", Core.Field.FieldType.PARAM_FIELD);
	}
	protected onConstructActionHandlers(){
		var onFormCreate = new OnFormCreateResource(this);
		this.createFormAction.setActionHandler(onFormCreate.getActionHandler());

		var onFormUpdate = new OnFormUpdateResource(this);
		this.updateFormAction.setActionHandler(onFormUpdate.getActionHandler());
		var onFormDelete = new OnFormDeleteResource(this);
		this.deleteFormAction.setActionHandler(onFormDelete.getActionHandler());
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
	public get createAction(): Core.Action.BaseAction { return this._createAction; }
	public get createFormAction(): Core.Action.BaseAction{ return this._createFormAction; }
	public get updateAction(): Core.Action.BaseAction { return this._updateAction; }
	public get updateFormAction(): Core.Action.BaseAction { return this._updateFormAction; }
	public get detailAction(): Core.Action.BaseAction {return this._detailAction; }
	public get deleteAction(): Core.Action.BaseAction { return this._deleteAction; }
	public get deleteFormAction(): Core.Action.BaseAction { return this._deleteFormAction; }
	public get fileAction(): Core.Action.BaseAction {return this._fileAction; }
	/**
 * przyśpiesza dodawanie pól body do CRUD.
 */
	public addField(name: string, formInputType: string, validatorFilterDataList: IValidationFilterData[], options?: Object) {
		options = options || {};
		var optional: boolean = options['optional'] || false;
		var fieldOptions = {};
		var fieldType = Core.Field.FieldType.BODY_FIELD;
		if(formInputType === Core.Form.FormInputType.FILE){
			fieldType = Core.Field.FieldType.FILE_FIELD;
			fieldOptions['maxFiles'] = options['fieldMaxFiles'] || 1;
		}
		var createField: Core.Field.BaseField = new Core.Field.BaseField(this.createAction, name, fieldType, fieldOptions);
		createField.optional = optional;
		createField.formInputType = formInputType;

		var updateField: Core.Field.BaseField = new Core.Field.BaseField(this.updateAction, name, fieldType, fieldOptions);
		updateField.optional = optional;
		updateField.formInputType = formInputType;
		/**
		 * Jeśli mamy do czynienia z edycją formularza, gdzie dane pole jest plikiem i jest opcjonalne
		 * to tworzymy dodatkowe pole tekstowe - docelowo będzie to checkbox który pozwala oznaczyć by usunąć stary plik
		 * bez dodania nowego
		 */
		if (formInputType === Core.Form.FormInputType.FILE && optional === true) {
			var fileHelperField: Core.Field.BaseField = new Core.Field.BaseField(this.updateAction, name, Core.Field.FieldType.BODY_FIELD, fieldOptions);
			fileHelperField.formInputType = Core.Form.FormInputType.CHECKBOX;
			fileHelperField.optional = true;
		}
		for (var i = 0; i < validatorFilterDataList.length; i++) {
			var validatorFilterData = validatorFilterDataList[i];
			if (validatorFilterData.class) {
				validatorFilterData.params.unshift(validatorFilterData.name);
				validatorFilterData.params.unshift(createField);
				var createValidatorFilter = Object.create(validatorFilterData.class.prototype);
				createValidatorFilter.constructor.apply(createValidatorFilter, validatorFilterData.params);
				validatorFilterData.params[0] = createField;
				var updateValidatorFilter = Object.create(validatorFilterData.class.prototype);
				updateValidatorFilter.constructor.apply(updateValidatorFilter, validatorFilterData.params);
			}
		}
		//na razie nie rozbudowujemy tego tak że system ma zamapowane typ forma a typy kolumn
		var column:Core.Column.BaseColumn;
		switch (formInputType){
			case Core.Form.FormInputType.FILE:
				if (options['db_file'] === true) {//znaczy że plik ma być zapisywany w bazie danych a nie na dysku
					column = new Core.Column.BlobColumn(name);
				} else {
					column = new Core.Column.JsonColumn(name);
				}
				break;
			default:
				column = new Core.Column.StringColumn(name, options['length'] || 50);
		}
		this.model.addColumn(column);
	}
}
export = Resource;