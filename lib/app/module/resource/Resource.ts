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
		this._model = new Core.Model("model");
		this.addModel(this._model, true);
	}
	protected onConstructActions(){
		this._fileAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "file");
		this._fileAction.addField(new Core.Field.BaseField("id", Core.Field.FieldType.PARAM_FIELD));
		var columntField = new Core.Field.BaseField("column", Core.Field.FieldType.QUERY_FIELD, { optional: true });
		this._fileAction.addField(columntField);

		this._fileAction.addField(new Core.Field.BaseField("count", Core.Field.FieldType.QUERY_FIELD, { optional: true }));
		this.addAction(this._fileAction);

		this._listAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "list");

		//order
		this._listAction.addField(new Core.Field.BaseField("o", Core.Field.FieldType.QUERY_FIELD, { optional: true }));
		//direction asc | desc
		this._listAction.addField(new Core.Field.BaseField("d", Core.Field.FieldType.QUERY_FIELD, { optional: true }));
		//page num
		this._listAction.addField(new Core.Field.BaseField("p", Core.Field.FieldType.QUERY_FIELD, { optional: true }));
		//page size
		this._listAction.addField(new Core.Field.BaseField("s", Core.Field.FieldType.QUERY_FIELD, { optional: true }));
		this.addAction(this._listAction, true);

		this._createAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "create");
		this.addAction(this._createAction);
		this._createFormAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "create");
		this.addAction(this._createFormAction);

		this.onConstructDetailAction();

		this._updateAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "update");
		this._updateAction.addField(new Core.Field.BaseField("id", Core.Field.FieldType.PARAM_FIELD));
		this.addAction(this._updateAction);
		this._updateFormAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "update");
		this._updateFormAction.addField(new Core.Field.BaseField("id", Core.Field.FieldType.PARAM_FIELD));
		this.addAction(this._updateFormAction);


		this._deleteAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "delete");
		this._deleteAction.addField(new Core.Field.BaseField("id", Core.Field.FieldType.PARAM_FIELD));
		this.addAction(this._deleteAction);
		this._deleteFormAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "delete");
		this._deleteFormAction.addField(new Core.Field.BaseField("id", Core.Field.FieldType.PARAM_FIELD));
		this.addAction(this._deleteFormAction);
	}
	protected onConstructDetailAction(){
		this._detailAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "detail");
		this.addAction(this._detailAction);
		var idField: Core.Field.BaseField = new Core.Field.BaseField("id", Core.Field.FieldType.PARAM_FIELD);
		this._detailAction.addField(idField);
	}
	protected onConstructActionHandlers(){
		// var onFormCreate = new OnFormCreateResource("horpyna/jade/createFormAction");
		var onFormCreate = new OnFormCreateResource(this);
		this.createFormAction.setActionHandler(onFormCreate.getActionHandler());

		// var onFormUpdate = new OnFormUpdateResource(this.model, "horpyna/jade/updateFormAction", this.listAction, this.fileAction);
		var onFormUpdate = new OnFormUpdateResource(this);
		this.updateFormAction.setActionHandler(onFormUpdate.getActionHandler());
		// var onFormDelete = new OnFormDeleteResource(this.model, "horpyna/jade/deleteFormAction", this.listAction, this.fileAction);
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
		var createField: Core.Field.BaseField = new Core.Field.BaseField(name, fieldType, fieldOptions);
		createField.optional = optional;
		createField.formInputType = formInputType;
		this.createAction.addField(createField);

		var updateField: Core.Field.BaseField = new Core.Field.BaseField(name, fieldType, fieldOptions);
		updateField.optional = optional;
		updateField.formInputType = formInputType;
		this.updateAction.addField(updateField);
		/**
		 * Jeśli mamy do czynienia z edycją formularza, gdzie dane pole jest plikiem i jest opcjonalne
		 * to tworzymy dodatkowe pole tekstowe - docelowo będzie to checkbox który pozwala oznaczyć by usunąć stary plik
		 * bez dodania nowego
		 */
		if (formInputType === Core.Form.FormInputType.FILE && optional === true) {
			var fileHelperField: Core.Field.BaseField = new Core.Field.BaseField(name, Core.Field.FieldType.BODY_FIELD, fieldOptions);
			fileHelperField.formInputType = Core.Form.FormInputType.CHECKBOX;
			fileHelperField.optional = true;
			this.updateAction.addField(fileHelperField);
		}
		for (var i = 0; i < validatorFilterDataList.length; i++) {
			var validatorFilterData = validatorFilterDataList[i];
			if (validatorFilterData.class) {
				validatorFilterData.params.unshift(validatorFilterData.name);
				var createValidatorFilter = Object.create(validatorFilterData.class.prototype);
				createValidatorFilter.constructor.apply(createValidatorFilter, validatorFilterData.params);
				var updateValidatorFilter = Object.create(validatorFilterData.class.prototype);
				updateValidatorFilter.constructor.apply(updateValidatorFilter, validatorFilterData.params);
				if (createValidatorFilter instanceof Core.Field.BaseValidator) {
					createField.addValidator(createValidatorFilter);
					updateField.addValidator(updateValidatorFilter);
				} else if (createValidatorFilter instanceof Core.Field.BaseFilter) {
					createField.addFilter(createValidatorFilter);
					updateField.addFilter(updateValidatorFilter);
				}
			}
		}

		//na razie nie rozbudowujemy tego tak że system ma zamapowane typ forma a typy kolumn
		switch (formInputType){
			case Core.Form.FormInputType.FILE:
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
export = Resource;