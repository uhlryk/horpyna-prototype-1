import Util = require("./util/Util");
class Element{
	private static _globalData: Object = new Object();
	private _data: Object;
	private static _logger: Util.Logger;
	private _debugger: Util.Debugger;
	constructor(){
		this._data = new Object();
	}
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
	public addGlobalValue(name:string, v:any){
		Element._globalData[name] = v;
	}
	public getGlobalValue(name:string):any{
		return Element._globalData[name];
	}
	public addValue(name:string, v:any){
		this._data[name] = v;
	}
	public getValue(name:string):any{
		return this._data[name];
	}
}
export = Element;