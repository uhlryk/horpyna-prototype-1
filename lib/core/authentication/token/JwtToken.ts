var jwt = require('json-web-token');
import Core = require("../../../index");
import BaseToken = require("./BaseToken");
class JwtToken extends BaseToken{
	private _secret: string;
	private _issuer: string;
	private _age: number;
	/**
	 * @param {string} secret          sekretny kod dla generowanych tokenów, bez tego  trudniej je zdekodować
	 * @param {string} issuer          dla kogo ten token - dla jakiej aplikacji, np gdy mamy wiele aplikacji
	 * @param {number} tokenValidation ile sekund token jest ważny
	 */
	constructor(secret :string, issuer:string, age:number){
		super();
		this._secret = secret;
		this._issuer = issuer;
		this._age = age;
	}
	public create(ownerId: number): Core.Util.Promise<string> {
		return new Core.Util.Promise<string>((resolve:(token:string)=>void)=>{
			jwt.encode(this._secret, {
				iss: this._issuer,
				iat: Core.Util._.parseInt((new Date().getTime()/1000).toString()),
				exp: Core.Util._.parseInt(((new Date().getTime() + this._age * 1000)/1000).toString()),
				sub: ownerId
			}, function(err, token) {
				resolve(token);
			});
		});
	}
	public getOwnerId(token: string): Core.Util.Promise<number> {
		if(token){
			return new Core.Util.Promise<number>((resolve: (ownerId: number) => void) => {
				jwt.decode(this._secret, token, (err, tokenData)=>{
					if (tokenData &&
							tokenData['sub'] &&
							tokenData['iss'] === this._issuer &&
							tokenData['iat'] &&
							tokenData['exp'] > Core.Util._.parseInt((new Date().getTime() / 1000).toString())) {
						resolve(tokenData['sub']);
					} else {
						resolve(0);
					}
				});
			});
		} else {
			return new Core.Util.Promise<number>((resolve:(ownerId:number)=>void)=>{
				resolve(0);
			});
		}
	}
}
export = JwtToken;