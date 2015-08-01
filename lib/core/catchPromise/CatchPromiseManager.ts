import CatchPromise = require("./CatchPromise");
import Util = require("./../util/Util");
import Element = require("./../Element");
/**
 * Obsługuje catch w promise chain
 * Zastosowanie przede wszystkich do BaseAction.requestHandler i do ComponentManager.init
 */

class CatchPromiseManager extends Element{
	private _catchList: CatchPromise[];
	private _finalCatch: CatchPromise;
	constructor(){
		super();
		this._catchList = [];
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
	public init(){}
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