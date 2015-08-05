/// <reference path="../../../../typings/tsd.d.ts" />
import Sequelize = require("sequelize");
import BaseCatchPromise = require("./../BaseCatchPromise");

class FinalInitCatchPromise extends BaseCatchPromise{
	public static DB_CONNECTION: string = "ActionCatchPromise: Not connected to db";
	constructor(){
		super();
		this.catchError = Sequelize['SequelizeConnectionRefusedError'];
	}
	public getCatchHandler(data?:any){
		var request = data['request'];
		var response = data['response'];
		var done = data['done'];
		return (err)=>{
			this.logger.error(FinalInitCatchPromise.DB_CONNECTION);
			response.setStatus(500);
			done();
		};
	}
}
export = FinalInitCatchPromise;