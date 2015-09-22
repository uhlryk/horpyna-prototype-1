import BaseFilter = require("./../BaseFilter");
import Field = require("./../Field");
var createHash = require('sha.js')
/**
 * zamienia wartość na reprezentację hash sha1
 */
class HashSha1 extends BaseFilter {
		public FILTER_NAME = "HashSha1";
		private _salt: string;
		private _sha;
		constructor(parent: Field.BaseField, name: string, salt: string) {
				super(parent, name, false);
				this._salt = salt;
				this._sha = createHash('sha256')
				this.initDebug("filter:" + this.FILTER_NAME);
		}
		protected logic(value: any): any {
				var hash = this._sha.update(this._salt + value, 'utf8').digest('hex');
				return hash;
		}
}
export = HashSha1;
