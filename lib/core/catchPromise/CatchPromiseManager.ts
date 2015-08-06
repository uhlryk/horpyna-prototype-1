import BaseCatchPromise = require("./BaseCatchPromise");
import Util = require("./../util/Util");
import Element = require("./../Element");
/**
 * Obsługuje catch w promise chain
 * Zastosowanie przede wszystkich do BaseAction.requestHandler i do ComponentManager.init
 */

class CatchPromiseManager extends Element{
	private _catchList: BaseCatchPromise[];
	private _finalCatch: BaseCatchPromise;
	constructor(){
		super();
		this._catchList = [];
	}
	/**
	 * dodaje catch do listy
	 * @param {BaseCatchPromise}   v      [description]
	 * @param {boolean} isFinal oznacza że będzie to ostatni catch
	 */
	public addCatch(v: BaseCatchPromise, isFinal?: boolean) {
		if (isFinal === true) {
			this._finalCatch = v;
		} else {
			this._catchList.push(v);
		}
	}
	public getCatchList():BaseCatchPromise[]{
		return this._catchList
	}
	public getFinalCatch():BaseCatchPromise{
		return this._finalCatch;
	}
	public init(){}
	public catchToPromise(promise: Util.Promise<any>, data?:any): Util.Promise<any> {
		var length = this._catchList.length;
		for (var i = 0; i < length; i++){
			var catchPromise:BaseCatchPromise = this._catchList[i];
			var handler = catchPromise.getCatchHandler(data);
			if (catchPromise.catchError) {
				promise = promise.catch(catchPromise.catchError, handler);

			} else {
				promise = promise.catch(handler);
			}
		}
		if (this._finalCatch){
			var handler = this._finalCatch.getCatchHandler(data);
			// if (catchPromise.catchError) {
				// promise = promise.catch(catchPromise.catchError, handler);

			// } else {
				promise = promise.catch(handler);
			// }
		}
		return promise;
	}
}
export = CatchPromiseManager;