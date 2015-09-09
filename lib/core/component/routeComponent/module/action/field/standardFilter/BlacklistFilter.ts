import Util = require("../../../../../../util/Util");
import BaseFilter = require("./../BaseFilter");
/**
 * z przekazanej wartości usuwa znaki wskazane w chars
 * znaki w chars dajemy jako string ale każdy jest osobno traktowany
 * w bebechach jest to pregmach dlatego jeśli używane są znaki specjalne pregmatch to muszą być
 * zaznaczone np znak [  oznaczymy \\[
 */
class BlacklistFilter extends BaseFilter {
	public FILTER_NAME = "BlacklistFilter";
	private _chars: string;
	constructor(name: string, chars: string) {
		super(name, false);
		this.initDebug("filter:" + this.FILTER_NAME);
		this._chars = chars;
	}
	protected logic(value: any):any {
		return Util.ValidatorList.blacklist(value, this._chars);
	}
}
export = BlacklistFilter;
