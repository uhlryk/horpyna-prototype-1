import Util = require("./util/Util");
class Element{
	private static _logger: Util.Logger = new Util.Logger();
	private _debugger: Util.Debugger;
	public initDebug(name:string){
		this._debugger = new Util.Debugger(name);
	}
	public debug(...args: any[]) {
		this._debugger.debug(args);
	}
	public get logger(): Util.Logger {
		return Element._logger;
	}
}
export = Element;