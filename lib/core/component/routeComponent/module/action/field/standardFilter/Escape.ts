import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * zastępuje znaki specjalne dla html odpowiednimi entities
 */
class Escape extends BaseFilter {
	public FILTER_NAME = "Escape";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.escape(value);
	}
}
export = Escape;
