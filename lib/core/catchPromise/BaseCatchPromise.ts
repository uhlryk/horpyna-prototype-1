import Util = require("./../util/Util");
import Element = require("./../Element");
class BaseCatchPromise extends Element{
	private _catchError;
	public set catchError(v:any){
		this._catchError = v;
	}
	public get catchError():any{
		return this._catchError;
	}
	public getCatchHandler(data?:any){
		return (err)=>{};
	}
}
export = BaseCatchPromise;