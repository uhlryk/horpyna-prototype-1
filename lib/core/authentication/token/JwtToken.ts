var jwt = require('json-web-token');
import Core = require("../../../index");
import BaseToken = require("./BaseToken");
class JwtToken extends BaseToken{
	private _secret: string;
	private _encode;
	private _decode;
	constructor(secret :string){
		this._decode = Core.Util.Promise.promisify(jwt.decode);
		super();
		this._secret = secret;
	}
	public create(ownerId: number): Core.Util.Promise<string> {
		return new Core.Util.Promise<string>((resolve:(token:string)=>void)=>{
			jwt.encode(this._secret, { id: ownerId }, function(err, token) {
				resolve(token);
			});
		});
	}
	public getOwnerId(token: string): Core.Util.Promise<number> {
		if(token){
			return new Core.Util.Promise<number>((resolve: (ownerId: number) => void) => {
				jwt.decode(this._secret, token, function(err, tokenData) {
					//sprawdzamy wiarygodność tokena
					if (tokenData && tokenData['id']) {
						resolve(tokenData['id']);
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