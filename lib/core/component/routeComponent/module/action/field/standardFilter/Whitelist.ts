import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
/**
 * z przekazanej wartości usuwa znaki które nie są w chars
 * znaki w chars dajemy jako string ale każdy jest osobno traktowany
 * w bebechach jest to pregmach dlatego jeśli używane są znaki specjalne pregmatch to muszą być
 * zaznaczone np znak [  oznaczymy \\[
 */
class Whitelist extends BaseFilter {
	public FILTER_NAME = "Whitelist";
	private _chars: string;
	constructor(parent: Field.BaseField, name: string, chars: string) {
		super(parent, name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
		this._chars = chars;
	}
	protected logic(value: any):any {
		return Util.ValidatorList.whitelist(value, this._chars);
	}
}
export = Whitelist;
