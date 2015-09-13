import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * przekształca wejście na datę lub zwraca null
 */
class ToDate extends BaseFilter {
	public FILTER_NAME = "ToDate";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.toDate(value);
	}
}
export = ToDate;
