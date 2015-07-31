import CatchPromise = require("./CatchPromise");

class FinalInitCatchPromise extends CatchPromise{
	public getCatchHandler(data?:any){
		return (err)=>{
			this.logger.error(err);

		};
	}
}
export = FinalInitCatchPromise;