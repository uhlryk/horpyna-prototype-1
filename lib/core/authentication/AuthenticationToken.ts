import Core = require("../../index");
/**
 * Klasa odpowiedzialna za autentykację użytkownika, obecnie jest to konkretna klasa
 * ale docelowo będzie BaseAuthentication i konkretne klasy
 */
class AuthenticationToken{
	/**
	 * Jeśli autentykacja się uda id danego usera będzie w polu request.app[_appFieldName]
	 */
	private _appFieldName: string;
	private _token: Core.Authentication.Token.BaseToken;
	private _headerKey: string;
	private _bodyKey: string;
	private _queryKey: string;
	constructor(token: Core.Authentication.Token.BaseToken) {
		this._token = token;
	}
	public setHeaderSource(key: string){
		this._headerKey = key;
	}
	public setBodySource(key: string){
		this._bodyKey = key;
	}
	public setQuerySource(key: string){
		this._queryKey = key;
	}
	public setAppFieldName(v:string){
		this._appFieldName = v;
	}
	protected getToken(request: Core.Action.Request):string {
		var token: string;
		if (this._headerKey){
			token = request.getExpressRequest().header(this._headerKey);
			if(token){
				return token;
			}
		} else if (this._bodyKey) {
			token = request.getExpressRequest().body[this._bodyKey];
			if (token) {
				return token;
			}
		} else if (this._queryKey) {
			token = request.getExpressRequest().query[this._queryKey];
			if (token) {
				return token;
			}
		}
	}
	public authenticate(request: Core.Action.Request):Core.Util.Promise<number> {
		var token = this.getToken(request);
		return this._token.getOwnerId(this.getToken(request))
		.then((ownerId)=>{
			if (ownerId){//ustawiamy
				request.addField(Core.Field.FieldType.APP_FIELD, this._appFieldName, ownerId);
				return ownerId;
			} else {
				return 0;//nie udało się określić użytkownika
			}
		});
	}
}
export = AuthenticationToken;