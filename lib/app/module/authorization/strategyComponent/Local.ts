import Core = require("../../../../index");
import IValidationFilterData = require("./../../IValidationFilterData");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class Local extends Core.Component {
	private _module: Core.App.Module.Authorization;
	private _model : Core.Model;
	private _loginColumnName: string;
	private _passwordColumnName: string;

	private _loginFormAction: Core.App.Module.ResourceAction.CreateForm;
	private _loginAction: Core.Action.BaseAction;
	constructor(parent: Core.App.Module.Authorization, name: string) {
		this._module = parent;
		super(parent, name);
	}
	public onConstructor() {
		this._loginFormAction = new Core.App.Module.ResourceAction.CreateForm(this._module, "login");
		this._loginAction = new Core.Action.BaseAction(this._module, Core.Action.BaseAction.POST, "login");

		this._loginFormAction.formGenerator.addFormAction(this._loginAction);
		this._loginFormAction.formGenerator.addFormAction(this._loginFormAction);
		this._loginFormAction.formGenerator.setTargetAction(this._loginAction);
	}
	public setModel(model:Core.Model, loginColumnName:string, passwordColumnName:string){
		this._model = model
		this._loginColumnName = loginColumnName;
		this._passwordColumnName = passwordColumnName;
	}
	protected addField(name: string, validatorFilterDataList: IValidationFilterData[]) {
		var fieldOptions = {};
		var fieldType = Core.Field.FieldType.BODY_FIELD;
		var loginField: Core.Field.BaseField = new Core.Field.BaseField(this._loginAction, name, fieldType, fieldOptions);
		loginField.formInputType = Core.Form.FormInputType.TEXT;
		for (var i = 0; i < validatorFilterDataList.length; i++) {
			var validatorFilterData = validatorFilterDataList[i];
			if (validatorFilterData.class) {
				validatorFilterData.params.unshift(validatorFilterData.name);
				validatorFilterData.params.unshift(loginField);
				var createValidatorFilter = Object.create(validatorFilterData.class.prototype);
				createValidatorFilter.constructor.apply(createValidatorFilter, validatorFilterData.params);
			}
		}
	}
}
export = Local;