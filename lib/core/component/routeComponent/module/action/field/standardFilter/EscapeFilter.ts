import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * zastępuje znaki specjalne dla html odpowiednimi entities
 */
class EscapeFilter extends BaseFilter {
	public FILTER_NAME = "EscapeFilter";
	constructor(name: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.escape(value);
	}
}
export = EscapeFilter;
