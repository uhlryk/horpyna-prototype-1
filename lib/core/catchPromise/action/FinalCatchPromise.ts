import BaseCatchPromise = require("./../BaseCatchPromise");

class FinalActionCatchPromise extends BaseCatchPromise {
	public getCatchHandler(data?: any) {
		var request = data['request'];
		var response = data['response'];
		var done = data['done'];
		return (err) => {
			this.logger.error(err);
			response.setStatus(500);
			this.logger.error("ACTION");
			done();
		};
	}
}
export = FinalActionCatchPromise;