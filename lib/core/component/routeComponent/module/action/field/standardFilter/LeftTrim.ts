import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * usuwa białe znaki z lewej lub inne wskazane znaki
 */
class LeftTrim extends BaseFilter {
	public FILTER_NAME = "LeftTrim";
	private _chars: string;
	constructor(parent: Field.BaseField, name: string, chars?: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
		this._chars = chars;
	}
	protected logic(value: any):any {
		return Util.ValidatorList.ltrim(value, this._chars);
	}
}
export = LeftTrim;
