import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * usuwa białe znaki z obu stron lub inne wskazane znaki
 */
class Trim extends BaseFilter {
	public FILTER_NAME = "Trim";
	private _chars: string;
	constructor(name: string, chars?: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
		this._chars = chars;
	}
	protected logic(value: any):any {
		return Util.ValidatorList.trim(value, this._chars);
	}
}
export = Trim;
