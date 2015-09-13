import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * usuwa białe znaki z obu stron lub inne wskazane znaki
 */
class Trim extends BaseFilter {
	public FILTER_NAME = "Trim";
	private _chars: string;
	constructor(parent: Field.BaseField, name: string, chars?: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
		this._chars = chars;
	}
	protected logic(value: any):any {
		return Util.ValidatorList.trim(value, this._chars);
	}
}
export = Trim;
