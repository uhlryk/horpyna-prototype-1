import Util = require("./../util/Util");
class CatchPromise{
	private _logger: Util.Logger;
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	public getCatchHandler(data?:any){
		return (err)=>{

		};
	}
}
export = CatchPromise;