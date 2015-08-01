import Util = require("./../util/Util");
import Element = require("./../Element");
class CatchPromise extends Element{
	public getCatchHandler(data?:any){
		return (err)=>{};
	}
}
export = CatchPromise;