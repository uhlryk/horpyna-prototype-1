/// <reference path="../../../../typings/tsd.d.ts" />
import Sequelize = require("sequelize");
import BaseCatchPromise = require("./../BaseCatchPromise");

class FinalInitCatchPromise extends BaseCatchPromise{
	public static DB_CONNECTION: string = "InitCatchPromise: Not connected to db";
	constructor(){
		super();
		this.catchError = Sequelize['SequelizeConnectionRefusedError'];
	}
	public getCatchHandler(data?:any){
		return (err)=>{
			this.logger.error(FinalInitCatchPromise.DB_CONNECTION);
		};
	}
}
export = FinalInitCatchPromise;