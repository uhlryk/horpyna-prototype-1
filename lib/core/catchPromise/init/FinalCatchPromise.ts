import BaseCatchPromise = require("./../BaseCatchPromise");

class FinalInitCatchPromise extends BaseCatchPromise{
	public getCatchHandler(data?:any){
		return (err)=>{
			this.logger.error("INIT");
			this.logger.error(err);

		};
	}
}
export = FinalInitCatchPromise;