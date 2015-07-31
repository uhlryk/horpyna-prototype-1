import CatchPromise = require("./CatchPromise");
import Util = require("./../util/Util");
/**
 * Obsługuje catch w promise chain
 * Zastosowanie przede wszystkich do BaseAction.requestHandler i do ComponentManager.init
 */

class CatchPromiseManager{
	private _catchList: CatchPromise[];
	private _finalCatch: CatchPromise;
	private _logger: Util.Logger;
	constructor(){
		this._catchList = [];
	}
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	/**
	 * dodaje catch do listy
	 * @param {CatchPromise}   v      [description]
	 * @param {boolean} isFinal oznacza że będzie to ostatni catch
	 */
	public addCatch(v: CatchPromise, isFinal?: boolean) {
		if (isFinal === true) {
			this._finalCatch = v;
		} else {
			this._catchList.push(v);
		}
	}
	public getCatchList():CatchPromise[]{
		return this._catchList
	}
	public getFinalCatch():CatchPromise{
		return this._finalCatch;
	}
	public init(){
		var length = this._catchList.length;
		for (var i = 0; i < length; i++) {
			var catchPromise: CatchPromise = this._catchList[i];
			catchPromise.logger = this.logger
		}
		if (this._finalCatch){
			this._finalCatch.logger = this.logger;
		}
	}
	public catchToPromise(promise: Util.Promise<any>, data?:any): Util.Promise<any> {
		var length = this._catchList.length;
		for (var i = 0; i < length; i++){
			var catchPromise:CatchPromise = this._catchList[i];
			var handler = catchPromise.getCatchHandler(data);
			promise = promise.catch(handler);
		}
		if (this._finalCatch){
			var handler = this._finalCatch.getCatchHandler(data);
			promise = promise.catch(handler);
		}
		return promise;
	}
}
export = CatchPromiseManager;