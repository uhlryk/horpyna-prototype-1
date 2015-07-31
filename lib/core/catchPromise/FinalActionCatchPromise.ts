import CatchPromise = require("./CatchPromise");

class FinalActionCatchPromise extends CatchPromise {
	public getCatchHandler(data?: any) {
		var request = data['request'];
		var response = data['response'];
		var done = data['done'];
		return (err) => {
			this.logger.error(err);
			done();
		};
	}
}
export = FinalActionCatchPromise;