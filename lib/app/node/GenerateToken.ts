import Core = require("../../index");
/**
 * Generuje token
 */
class GenerateToken extends Core.Node.BaseNode {
	private _token: Core.Authentication.Token.BaseToken;
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:GenerateToken");
	}
	public setToken(token: Core.Authentication.Token.BaseToken) {
		this._token = token;
	}
	public setOwnerId(type: string, key: string){
		this.setMapSource("ownerId", type, key);
	}
	protected promiseContent(data: Core.Node.NodeData): Core.Util.Promise<any> {
		this.debug("begin");
		var processResponse = {};
		var ownerId = Number(data.getMappedValue("ownerId"));
		this.debug("generate token for ownerId: " + ownerId);
		return this._token.create(ownerId)
		.then((tokenValue)=>{
			return { token: tokenValue };
		});
	}
}
export = GenerateToken;