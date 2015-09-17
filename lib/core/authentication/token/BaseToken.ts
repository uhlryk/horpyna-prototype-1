import Core = require("../../../index");
class BaseToken{
	public create(ownerId: number): Core.Util.Promise<string> {
		return new Core.Util.Promise<string>((resolve:(token:string)=>void)=>{
			resolve("");
		});
	}
	public getOwnerId(token: string): Core.Util.Promise<number> {
		return new Core.Util.Promise<number>((resolve:(ownerId:number)=>void)=>{
			resolve(0);
		});
	}
}
export = BaseToken;