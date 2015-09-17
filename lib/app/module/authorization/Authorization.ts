import Core = require("../../../index");
import StrategyComponent = require("./strategyComponent/index");
class Authorization extends Core.Module {
	/**
	 * Jeśli autentykacja się uda id danego usera będzie w polu request.app[_appFieldName]
	 * @type {string}
	 */
	private _appFieldName: string;
	private _authentication: Core.Authentication.AuthenticationToken;
	private _accessControl: Core.AccessControl;
	private _token :  Core.Authentication.Token.BaseToken
	public onConstructor() {
		super.onConstructor();
		this.configToken();
		this.configAuthentication();
		this.configAccessControl();
		this.setAuthenticationStrategies();
		this.setOnBeginEventListener();
	}
	protected configToken(){
		this._token = new Core.Authentication.Token.BaseToken();
	}
	protected configAuthentication() {
		this._authentication = new Core.Authentication.AuthenticationToken(this._token);
	}
	protected configAccessControl(){
		this._accessControl = new Core.AccessControl(this, "acl", Core.AccessControl.STORAGE_MEMORY);
	}
	public setAppFieldName(v:string){
		this._appFieldName = v;
		this._authentication.setAppFieldName(this._appFieldName);
	}
	protected setAuthenticationStrategies(){
		var localStrategyComponent = new StrategyComponent.Local(this, "local");
	}
	/**
	 * dla danej akcji jaka rola ma dostęp
	 */
	public allow(roleList: string[], actionList: Core.Action.BaseAction[]): Core.Util.Promise<void> {
		return this._accessControl.allow(roleList, actionList);
	}
	protected setOnBeginEventListener() {
		var event = new Core.App.Module.AuthorizationEventListener.OnBegin(this, "authorization", true);
		event.setAuthentication(this._authentication);
		event.setActionControl(this._accessControl);
	}
}
export = Authorization;