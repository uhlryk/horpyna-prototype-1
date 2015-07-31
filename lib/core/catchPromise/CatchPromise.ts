import Util = require("./../util/Util");
class CatchPromise{
	private _catchHandler;
	private _logger: Util.Logger;
	constructor(){
		this._catchHandler = this.catchHandler;
	}
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	public setCatchHandler(v){
		this._catchHandler = v;
	}
	public getCatchHandler(){
		return (err)=>{
			this._catchHandler(err);
		};
	}
	protected catchHandler(error){}
}
export = CatchPromise;