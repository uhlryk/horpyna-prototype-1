/// <reference path="../../../typings/tsd.d.ts" />
import passport = require("passport");
import Core = require("../../index");
import TokenSessionStrategy = require("./TokenSessionStrategy");
class Authentication{
	public getMiddleware():Function{
		return passport.initialize();
	}
	public setTokenStrategy(callback:Function){
		passport.use("token", new TokenSessionStrategy({}, function(tokenSession, done) {
			callback(tokenSession, done);
		}));
	}
	public authenticateToken(request: Core.Action.Request, response: Core.Action.Response, next:Function) {
		var middleware = passport.authenticate("token", { session: false });
		middleware(request.getExpressRequest(), response.getExpressResponse(), next);
	}
}
export = Authentication;