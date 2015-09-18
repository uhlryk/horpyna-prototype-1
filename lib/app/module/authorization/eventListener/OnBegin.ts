import Core = require("./../../../../index");

class OnBegin extends Core.EventListener.Action.OnBegin {
	private _authentication: Core.Authentication.AuthenticationToken;
	private _accessControl: Core.AccessControl;
	constructor(parent: Core.Module, name: string, publicEvent?: boolean) {
		super(parent, name, publicEvent);
		this.setHandler((request: Core.Action.Request, response: Core.Action.Response, done) => {
			this.eventHandler(request, response, done);
		});
	}
	public setActionControl(v: Core.AccessControl) {
		this._accessControl = v;
	}
	public setAuthentication(v: Core.Authentication.AuthenticationToken) {
		this._authentication = v;
	}
	/**
	 * sprawdza czy dana akcja wymaga jakiejś roli jeśli tak, to musimy przeprowadzić autentykację
	 */
	protected eventHandler(request: Core.Action.Request, response: Core.Action.Response, done): void {
		this._accessControl.isActionRestricted(request.action)
		.then((isRestricted) => {
			if (isRestricted) {
				return this._authentication.authenticate(request)
				.then((ownerId)=>{//jeśli true to ustawiliśmy usera
						if (ownerId) {
							return this._accessControl.isAllowed(ownerId, request.action)
							.then((isAccess)=>{
								if(isAccess){
									done();//kończy event
								} else{//brak dostępu dla tego użytkownika
									this.onAccessDenied(request, response, done);
								}
							});
					} else { // brak użytkownika do akcji wymagającej uprawnienia.
						this.onAccessDenied(request, response, done);
					}
				});
			} else {
				done();//kończy event
			}
		});
	}
	/**
	 * wywoływane gdy brak dostępu
	 * tu określamy kod błędu i by do akcji nie wchodził.
	 * Możemy ustawić przekierowanie na akcję logowania
	 */
	protected onAccessDenied(request: Core.Action.Request, response: Core.Action.Response, done) {
		response.setStatus(401);
		response.allow = false;
		done();
	}
}
export = OnBegin;