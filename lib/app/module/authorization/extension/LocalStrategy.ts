import Core = require("../../../../index");
import IValidationFilterData = require("./../../IValidationFilterData");
/**
 * Dodatek wzbogacający autoryzację o strategię uwierzytelniającą przez login i hasło znajdujące się w danym zasobie
 * Extension nie ogranicza się do konkretnie loginu i hasła. mogą to być dowolne pola z dowolnego zasobu które muszą się zgadzać
 */
class LocalStrategy extends Core.Extension {
	private _model : Core.Model;
	private _loginFormAction: Core.App.Module.ResourceAction.Form;
	private _loginAction: Core.Action.BaseAction;
	private _tokenGenerator: Core.App.Node.GenerateToken;
	private _findDbData: Core.Node.Db.Find;
	constructor(parent: Core.App.Module.Authorization) {
		super(parent);
		this._tokenGenerator.setToken(this.getComponent().token);
	}
	protected getComponent(): Core.App.Module.Authorization {
		return <Core.App.Module.Authorization>super.getComponent();
	}
	public onConstructor() {
		this._loginFormAction = new Core.App.Module.ResourceAction.Form(this.getComponent(), "login");
		this._loginAction = new Core.Action.BaseAction(this.getComponent(), Core.Action.BaseAction.POST, "login");
		this._loginFormAction.formGenerator.addFormAction(this._loginAction);
		this._loginFormAction.formGenerator.addFormAction(this._loginFormAction);
		this.configProcessModel();
	}
	protected configProcessModel() {
		var processModel = new Core.Node.ProcessModel(this._loginAction);
		this._findDbData = new Core.Node.Db.Find([processModel]);
		this._findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		this._findDbData.addWhere(Core.Node.SourceType.APP_FIELD);
		var ifDataExist = new Core.Node.Gateway.IfExist([this._findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([this._findDbData]);
		ifDataNotExist.setNegation();
		var dataNotExistResponse = new Core.Node.Response.SendData([ifDataNotExist]);
		dataNotExistResponse.setStatus(422);
		this._tokenGenerator = new Core.App.Node.GenerateToken([ifDataExist]);
		this._tokenGenerator.setOwnerId(Core.Node.SourceType.RESPONSE_NODE_1, 'id');
		var tokenResponse = new Core.Node.Response.SendData([this._tokenGenerator]);
		tokenResponse.setStatus(200);
	}
	public setModel(model:Core.Model, loginColumnName:string, passwordColumnName:string){
		this._model = model
		this._findDbData.setModel(this._model);
	}
	protected addField(name: string, validatorFilterDataList: IValidationFilterData[]) {
		var fieldType = Core.Field.FieldType.BODY_FIELD;
		var loginField: Core.Field.BaseField = new Core.Field.BaseField(this._loginAction, name, fieldType, fieldOptions);
		var fieldOptions = {};
		fieldOptions['type'] = "input";
		Core.App.Module.Resource.createFieldsValidators([loginField], validatorFilterDataList);
	}
}
export = LocalStrategy;