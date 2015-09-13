import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * przekształca wejście na string
 */
class ToString extends BaseFilter {
	public FILTER_NAME = "ToString";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.toString(value);
	}
}
export = ToString;
