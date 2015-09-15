import Core = require("../../../index");
class Auth extends Core.Module {
	private _authentication: Core.Authentication;
	private _accessControl: Core.AccessControl;
	private _session: Core.TokenSession;
	/**
	 * specjalna rola dodawana do wszystkich zasobów. Określa że ten zasób wymaga jakiejś autoryzacji
	 * nie można wywołać listy zasobów to bedziemy sprawdzać czy dany zasób ma uprawnienia do tej roli
	 * jeśli tak to znaczy że zasób wymaga autoryzacji. Jeśli nie, to nie wymaga
	 */
	private ALL_RESOURCE_ROLE = "all_resource_role";
	public onConstructor() {
		super.onConstructor();
		this.configSession();
		this.configAuthentication();
		this.configAccessControl();
		this.addEvents();
	}
	protected configSession(){
		this._session = new Core.TokenSession(this.name, "fsssadgew", "access_token");
		this.componentManager.dispatcher.addMiddleware(this._session.getMiddleware());
	}
	protected configAuthentication() {
		this._authentication = new Core.Authentication();
		this.componentManager.dispatcher.addMiddleware(this._authentication.getMiddleware());

		this._authentication.setTokenStrategy((tokenSession, done) => {
			console.log("token strategy ");
			console.log(tokenSession);
			return done(null, {name:"Test"}, { scope: 'all' });
		});
	}
	protected configAccessControl(){
		this._accessControl = new Core.AccessControl(this, "acl", Core.AccessControl.STORAGE_MEMORY);
	}
	public getAccessControl():Core.AccessControl{
		return this._accessControl;
	}
	public allow(roleList: string[], actionList: Core.Action.BaseAction[]): Core.Util.Promise<void> {
		roleList.push(this.ALL_RESOURCE_ROLE);
		return this._accessControl.allow(roleList, actionList);
	}
	protected addEvents() {
		var event1 = new Core.EventListener.Action.OnBegin(this, "authorizeAll1", true);
		event1.setHandler((request, response, done) => {
			console.log("run event from auth Action.OnBegin");
			/**
			 * sprawdza czy dana akcja wymaga jakiejś roli jeśli tak, to musimy przeprowadzić autentykację
			 */
			this._accessControl.isRoleAllowedResource(this.ALL_RESOURCE_ROLE, request.action)
			.then((isRestricted) => {
				if (isRestricted) {
					this._authentication.authenticateToken(request, response, done);
				} else {
					done();
				}
			});
		});
		var event2 = new Core.EventListener.Dispatcher.OnBegin(this, "authorizeAll2", true);
		event2.setHandler((request, response, done) => {
			console.log("run event from auth Dispatcher.OnBegin");
			done();
		});
	}
}
export = Auth;