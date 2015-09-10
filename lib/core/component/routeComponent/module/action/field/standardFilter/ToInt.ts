import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * przekształca wejście na liczbę całkowitą lub 0
 */
class ToInt extends BaseFilter {
	public FILTER_NAME = "ToInt";
	public _radix:number;
	constructor(name: string, radix:number=10) {
		super(name, false);
		this._radix = radix;
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		var res = Util.ValidatorList.toInt(value, this._radix);
		if(isNaN(res))res =0 ;
		return res;
	}
}
export = ToInt;
