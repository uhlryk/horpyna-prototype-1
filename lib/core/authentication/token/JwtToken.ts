var jwt = require('json-web-token');
import Core = require("../../../index");
import BaseToken = require("./BaseToken");
class JWTToken extends BaseToken{
	private _secret: string;
	private _encode;
	private _decode;
	constructor(secret :string){
		this._encode = Core.Util.Promise.promisify(jwt.encode);
		this._decode = Core.Util.Promise.promisify(jwt.decode);
		super();
		this._secret = secret;
	}
	public create(ownerId: number): Core.Util.Promise<string> {
		return this._encode(this._secret, {
			id: ownerId
		});
	}
	public getOwnerId(token: string): Core.Util.Promise<number> {
		return this._decode(this._secret, token)
		.then((authData)=>{
			return authData['id'];
		});
	}
}
export = JWTToken;