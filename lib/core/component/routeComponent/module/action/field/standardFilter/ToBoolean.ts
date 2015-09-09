import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * zastępuje wszystko true z wyjątkiem '0', 'false' and ''
 */
class ToBoolean extends BaseFilter {
	public FILTER_NAME = "ToBoolean";
	constructor(name: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.toBoolean(value);
	}
}
export = ToBoolean;
