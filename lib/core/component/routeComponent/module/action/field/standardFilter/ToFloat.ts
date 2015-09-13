import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * przekształca wejście na liczbę zmiennoprzecinkową lub 0
 */
class ToFloat extends BaseFilter {
	public FILTER_NAME = "ToFloat";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		var res = Util.ValidatorList.toFloat(value);
		if(isNaN(res))res =0 ;
		return res;
	}
}
export = ToFloat;
