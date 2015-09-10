import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * przekształca wejście na datę lub zwraca null
 */
class ToDate extends BaseFilter {
	public FILTER_NAME = "ToDate";
	constructor(name: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.toDate(value);
	}
}
export = ToDate;
