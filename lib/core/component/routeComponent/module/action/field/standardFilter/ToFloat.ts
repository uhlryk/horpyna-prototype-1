import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * przekształca wejście na liczbę zmiennoprzecinkową lub 0
 */
class ToFloat extends BaseFilter {
	public FILTER_NAME = "ToFloat";
	constructor(name: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		var res = Util.ValidatorList.toFloat(value);
		if(isNaN(res))res =0 ;
		return res;
	}
}
export = ToFloat;
