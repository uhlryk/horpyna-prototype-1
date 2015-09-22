import Core = require("../../../index");
class Authorization extends Core.Module {
	/**
	 * Jeśli autentykacja się uda id danego usera będzie w polu request.app[_appFieldName]
	 */
	private _appFieldName: string;
	private _authentication: Core.Authentication.AuthenticationToken;
	private _accessControl: Core.AccessControl;
	private _token: Core.Authentication.Token.BaseToken;
	public onConstructor() {
		super.onConstructor();
		this.configToken();
		this.configAuthentication();
		this.configAccessControl();
		this.setOnBeginEventListener();
	}
	protected configToken(){
		var config = this.getConfig();
		var jwt = config.getKey("jwt")
		this._token = new Core.Authentication.Token.JwtToken(jwt["secret"], jwt["issuer"], jwt["age"]);
	}
	protected configAuthentication() {
		this._authentication = new Core.Authentication.AuthenticationToken(this._token);
		this._authentication.setQuerySource("access_token");
	}
	protected configAccessControl(){
		this._accessControl = new Core.AccessControl(this, "acl", Core.AccessControl.STORAGE_MEMORY);
	}
	public setAppFieldName(v:string){
		this._appFieldName = v;
		this._authentication.setAppFieldName(this._appFieldName);
	}
	public get token(): Core.Authentication.Token.BaseToken{
		return this._token;
	}
	/**
	 * dla danej akcji jaka rola ma dostęp
	 */
	public allow(roleList: string[], actionList: Core.Action.BaseAction[]): Core.Util.Promise<void> {
		return this._accessControl.allow(roleList, actionList);
	}
	public addUserRoles(userId:number, roleList:string[]): Core.Util.Promise<void> {
		return this._accessControl.addUserRoles(userId, roleList);
	}
	protected setOnBeginEventListener() {
		var event = new Core.App.Module.AuthorizationEventListener.OnBegin(this, "authorization", true);
		event.setAuthentication(this._authentication);
		event.setActionControl(this._accessControl);
	}
}
export = Authorization;