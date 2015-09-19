import IValidationFilterData = require("./../IValidationFilterData");
import Core = require("../../../index");
import Action = require("./action/index");
class Resource extends Core.Module {
	private _model: Core.Model;
	private _listAction: Action.List;
	private _metaAction: Action.Meta;
	private _createAction: Action.Create;
	private _createFormAction: Action.Form;
	private _updateAction: Action.Update;
	private _updateFormAction: Action.Form;
	private _detailAction: Action.Detail;
	private _deleteAction: Action.Delete;
	private _fileAction: Action.File;
	public onConstructor() {
		super.onConstructor();
		this.onConstructModels();
		this.onConstructActions();
		this.onConstructActionHandlers();
		this.configActions();
	}
	protected onConstructModels(){
		this._model = new Core.Model(this, "default");
	}
	protected onConstructActions(){
		this._fileAction = new Action.File(this, "file");
		this._listAction = new Action.List(this, "list");
		this._metaAction = new Action.Meta(this, "meta");
		this._createAction = new Action.Create(this, "create");
		this._createFormAction = new Action.Form(this, "create");
		this._detailAction = new Action.Detail(this, "detail");
		this._updateAction = new Action.Update(this, "update");
		this._updateFormAction = new Action.Form(this, "update");
		new Core.Field.BaseField(this._updateFormAction, "id", Core.Field.FieldType.PARAM_FIELD);
		this._deleteAction = new Action.Delete(this, "delete");
	}
	protected onConstructActionHandlers(){
		this._detailAction.configProcessModel();
		this._listAction.configProcessModel();
		this._metaAction.configProcessModel();
		this.fileAction.configProcessModel();
		this.createAction.configProcessModel();
		this.updateAction.configProcessModel();
		this.deleteAction.configProcessModel();
	}
	protected configActions(){
		this.createFormAction.formGenerator.addFormAction(this.createAction);
		this.createFormAction.formGenerator.addFormAction(this.createFormAction);

		this.updateFormAction.formGenerator.addFormAction(this.updateAction);
		this.updateFormAction.formGenerator.addFormAction(this.updateFormAction);
	}
	public get model(): Core.Model{return this._model; }
	public get listAction(): Action.List { return this._listAction; }
	public get metaAction(): Action.Meta { return this._metaAction; }
	public get createAction(): Action.Create { return this._createAction; }
	public get createFormAction(): Action.Form { return this._createFormAction; }
	public get updateAction(): Action.Update { return this._updateAction; }
	public get updateFormAction(): Action.Form { return this._updateFormAction; }
	public get detailAction(): Action.Detail { return this._detailAction; }
	public get deleteAction(): Action.Delete { return this._deleteAction; }
	public get fileAction(): Action.File { return this._fileAction; }
	/**
	 * Możemy podać różne pola i do wszystkich zostaną dodane dane validatory i filtry
	 */
	public static createFieldsValidators(fieldList: Core.Field.BaseField[], validatorFilterDataList: IValidationFilterData[] ) {
		for (var i = 0; i < validatorFilterDataList.length; i++) {
			var validatorFilterData = validatorFilterDataList[i];
			if ( validatorFilterData['class']) {
				validatorFilterData.params.unshift(validatorFilterData.name);
				validatorFilterData.params.unshift(null);
				for (var j = 0 ; j < fieldList.length; j++){
					var field = fieldList[j];
					var validatorFilter = Object.create(validatorFilterData['class'].prototype);
					validatorFilterData.params[0] = field;
					validatorFilter.constructor.apply(validatorFilter, validatorFilterData.params);
				}
			}
		}
	}
	/**
	 * Wartości jakie może mieć options:
	 * options.optional oznacza że pole nie jest obowiązkowe, nie generuje błędu walidacji gdy pole nieustawione
	 * options.fileType jest kilka sposobów zapisu pliku określamy sposób 'protected' | 'database' | 'public'
	 * options.maxFiles ile plików możemy zaakceptować za jednym razem przez to pole
	 * options.columnName - domyślnie tabela w bazie będzie mieć nazwę jak name ale możemy to nadpisać
	 */
	public addFileField(name: string, validatorFilterDataList: IValidationFilterData[], options?: Object) {
		options = options || {};
		var optional: boolean = options['optional'] || false;
		var fieldType = Core.Field.FieldType.FILE_FIELD;
		var fieldOptions = {};
		fieldOptions['type'] = "file";
		fieldOptions['fileType'] = options['protected'] || "protected";
		fieldOptions['maxFiles'] = options['fieldMaxFiles'] || 1;
		var createField: Core.Field.BaseField = new Core.Field.BaseField(this.createAction, name, fieldType, fieldOptions);
		createField.optional = optional;
		var updateField: Core.Field.BaseField = new Core.Field.BaseField(this.updateAction, name, fieldType, fieldOptions);
		updateField.optional = optional;
		if (optional === true) {
			fieldOptions['type'] = "fileDelete";
			var fileHelperField: Core.Field.BaseField = new Core.Field.BaseField(this.updateAction, name, Core.Field.FieldType.BODY_FIELD, fieldOptions);
			fileHelperField.optional = true;
		}
		Resource.createFieldsValidators([createField, updateField], validatorFilterDataList);
		var column = new Core.Column.JsonColumn(options['columnName'] || name);
		this.model.addColumn(column);
	}
	/**
 * przyśpiesza dodawanie pól body do CRUD.
 * Wartości jakie może mieć options:
 * options.optional oznacza że pole nie jest obowiązkowe, nie generuje błędu walidacji gdy pole nieustawione
 * options.columnName - domyślnie tabela w bazie będzie mieć nazwę jak name ale możemy to nadpisać
 * options.columnType - typ kolumny
 */
	public addField(name: string, validatorFilterDataList: IValidationFilterData[], options?: Object) {
		options = options || {};
		var optional: boolean = options['optional'] || false;
		var fieldType = Core.Field.FieldType.BODY_FIELD;
		var fieldOptions = {};
		fieldOptions['type'] = "input";
		var createField: Core.Field.BaseField = new Core.Field.BaseField(this.createAction, name, fieldType, fieldOptions);
		createField.optional = optional;
		var updateField: Core.Field.BaseField = new Core.Field.BaseField(this.updateAction, name, fieldType, fieldOptions);
		updateField.optional = optional;
		Resource.createFieldsValidators([createField, updateField], validatorFilterDataList);
		var column:Core.Column.BaseColumn;
		switch (options['columnType']) {
			case "BlobColumn":
				column = new Core.Column.BlobColumn(name, options['length'] || 200);
				break;
			case "IntegerColumn":
				column = new Core.Column.IntegerColumn(name);
				break;
			case "BigIntColumn":
				column = new Core.Column.BigIntColumn(name, options['length'] || 15);
				break;
			case "DateColumn":
				column = new Core.Column.DateColumn(name);
				break;
			case "DecimalColumn":
				column = new Core.Column.DecimalColumn(name, options['total'] || 9, options['decimal'] || 2);
				break;
			default:
				column = new Core.Column.StringColumn(name, options['length'] || 50);
		}
		this.model.addColumn(column);
	}
}
export = Resource;