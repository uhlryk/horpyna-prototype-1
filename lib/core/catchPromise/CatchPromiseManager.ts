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
	public addCatch(v: CatchPromise, isFinal: boolean) {
		v.logger = this.logger;
		if (isFinal === true) {
			this._finalCatch = v;
		} else {
			this._catchList.push(v);
		}
	}
	public catchToPromise(promise: Util.Promise<any>): Util.Promise<any> {
		var length = this._catchList.length;
		for (var i = 0; i < length; i++){
			var catchPromise:CatchPromise = this._catchList[i];
			var handler = catchPromise.getCatchHandler();
			promise = promise.catch(handler);
		}
		if (this._finalCatch){
			var handler = this._finalCatch.getCatchHandler();
			promise = promise.catch(handler);
		}
		return promise;
	}
}
export = CatchPromiseManager;