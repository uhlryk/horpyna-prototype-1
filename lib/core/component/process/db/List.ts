import BaseDbNode = require("./BaseDbNode");
import Util = require("./../../../util/Util");
class List extends BaseDbNode {

	protected content(processEntry: any): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			resolve("dummy text");
		});
	}
}
export = List;