import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * zastępuje znaki specjalne dla html odpowiednimi entities
 */
class Escape extends BaseFilter {
	public FILTER_NAME = "Escape";
	constructor(name: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.escape(value);
	}
}
export = Escape;
