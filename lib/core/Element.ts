import Util = require("./util/Util");
class Element{
	private static _logger: Util.Logger;
	private _debugger: Util.Debugger;
	public initDebug(name:string){
		this._debugger = new Util.Debugger(name);
	}
	public debug(...args: any[]) {
		this._debugger.debug(args);
	}
	public static initLogger(v: Util.Logger) {
		Element._logger = v;
	}
	public get logger(): Util.Logger {
		return Element._logger;
	}
}
export = Element;