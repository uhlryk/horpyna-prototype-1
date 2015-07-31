import CatchPromise = require("./CatchPromise");

class FinalInitCatchPromise extends CatchPromise{
	protected catchHandler(error) {
		this.logger.error(error);
	}
}
export = FinalInitCatchPromise;