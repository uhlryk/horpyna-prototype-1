var redis = require("redis");
var JWTRedisSession = require("jwt-redis-session");
/**
 * NA RAZIE NIE UŻYWANE
 *
 * wrapper na jwt-redis-session. Sprawdza czy został otrzymany jwt token
 * Jeśli tak to sprawdza czy mamy z tym tokenem powiązany w bazie redis klucz
 * Jeśli tak to sprawdza poprawność tokena i wyciąga dane z bazy tworząc z nimi sesje
 * sesja jest pod req[keyName]
 */
class TokenSession {
	private _dbClient;
	private _session;
	private _secret: string;
	private _name: string;//nazwa session, między innymi prefix w redis
	private _fieldName: string;
	private _sessionkey: string;//klucz w req
	constructor(name:string, secret:string,fieldName:string){
		this._secret = secret;
		this._name = name;
		this._fieldName = fieldName;
		this._sessionkey = "tokensession";
		this.configDbClient();
		this.configSession();
	}
	public get sessionKey():string{
		return this._sessionkey;
	}
	protected configDbClient(){
		this._dbClient = redis.createClient();
	}
	protected configSession(){
		this._session = JWTRedisSession({
			client: this._dbClient,
			secret: this._secret,
			keyspace: this._name,
			maxAge: 86400,
			algorithm: "HS256",
			requestKey: this._sessionkey,
			requestArg: this._fieldName
		});
	}
	public getMiddleware():Function{
		return this._session;
	}
}
export = TokenSession;