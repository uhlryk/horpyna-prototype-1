import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * zastępuje wszystko true z wyjątkiem '0', 'false' and ''
 */
class ToBoolean extends BaseFilter {
	public FILTER_NAME = "ToBoolean";
	constructor(parent: Field.BaseField, name: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
	}
	protected logic(value: any):any {
		return Util.ValidatorList.toBoolean(value);
	}
}
export = ToBoolean;
