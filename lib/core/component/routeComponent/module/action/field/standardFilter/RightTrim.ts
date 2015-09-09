import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * usuwa białe znaki z lewej lub inne wskazane znaki
 */
class RightTrim extends BaseFilter {
	public FILTER_NAME = "RightTrim";
	private _chars: string;
	constructor(name: string, chars?: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
		this._chars = chars;
	}
	protected logic(value: any):any {
		return Util.ValidatorList.rtrim(value, this._chars);
	}
}
export = RightTrim;
