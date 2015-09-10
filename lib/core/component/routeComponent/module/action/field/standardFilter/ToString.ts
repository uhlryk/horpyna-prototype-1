import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * przekształca wejście na string
 */
class ToString extends BaseFilter {
	public FILTER_NAME = "ToString";
	constructor(name: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.toString(value);
	}
}
export = ToString;
