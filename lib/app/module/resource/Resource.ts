import IValidationFilterData = require("./../IValidationFilterData");
import Core = require("../../../index");
import Action = require("./action/Action");
class Resource extends Core.Module {
	private _model: Core.Model;
	private _listAction: Action.List;
	private _createAction: Action.Create;
	private _createFormAction: Action.CreateForm;
	private _updateAction: Action.Update;
	private _updateFormAction: Action.UpdateForm;
	private _detailAction: Action.Detail;
	private _deleteAction: Action.Delete;
	private _deleteFormAction: Action.DeleteForm;
	private _fileAction: Action.File;
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
		this._fileAction = new Action.File(this, "file");
		this._listAction = new Action.List(this, "list");
		this._createAction = new Action.Create(this, "create");
		this._createFormAction = new Action.CreateForm(this, "create");
		this._detailAction = new Action.Detail(this, "detail");
		this._updateAction = new Action.Update(this, "update");
		this._updateFormAction = new Action.UpdateForm(this, "update");
		this._deleteAction = new Action.Delete(this, "delete");
		this._deleteFormAction = new Action.DeleteForm(this, "delete");
	}
	protected onConstructActionHandlers(){
		this._detailAction.configProcessModel();
		this._listAction.configProcessModel();
		this.fileAction.configProcessModel();
		this.createAction.configProcessModel();
		this.createFormAction.configProcessModel();
		this.updateAction.configProcessModel();
		this.updateFormAction.configProcessModel();
		this.deleteAction.configProcessModel();
		this.deleteFormAction.configProcessModel();
	}
	public get model(): Core.Model{return this._model; }
	public get listAction(): Action.List { return this._listAction; }
	public get createAction(): Action.Create { return this._createAction; }
	public get createFormAction(): Action.CreateForm { return this._createFormAction; }
	public get updateAction(): Action.Update { return this._updateAction; }
	public get updateFormAction(): Action.UpdateForm { return this._updateFormAction; }
	public get detailAction(): Action.Detail { return this._detailAction; }
	public get deleteAction(): Action.Delete { return this._deleteAction; }
	public get deleteFormAction(): Action.DeleteForm { return this._deleteFormAction; }
	public get fileAction(): Action.File { return this._fileAction; }
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