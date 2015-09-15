/// <reference path="../../../typings/tsd.d.ts" />
import passportStrategy = require("passport-strategy");
/**
 * SPecjalna strategia dla passport która współpracuje z session.TokenSession
 * Gdy otrzymujemy jwt tokeny to najpierw session.TokenSession je rozbija na request.customSessionKey
 * a ta strategia pozwala określić uprawnienia w związku z tym wynikające
 */
class TokenSessionStrategy extends passportStrategy.Strategy {
	private _tokenSessionKey: string;
	private _options: {};
	private _verify: (tokenSession, verified) => void;
	constructor(options: {}, verify: (tokenSession, verified) => void) {
		this._options = options;
		this._tokenSessionKey = this._options['tokenSessionKey'] || "tokensession";
		this._verify = verify;
		super();
	}
	public authenticate(req, options?: any){
		var tokenSession = req[this._tokenSessionKey];
		if (tokenSession && tokenSession['id']) {
			this._verify(tokenSession, (err, user, info)=>{
				this.verified(err, user, info);
			});
		} else {
			this.fail(401);
		}
	}
	public verified(err, user:{}, info:string) {
		if (err) { return this.error(err); }
		if (!user) {
			this.fail(info,401);
		}
		this.success(user, info);
	}
}
export = TokenSessionStrategy;
