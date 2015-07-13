import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");

class WhereQuery extends BaseQuery{
	private list:Object;
	constructor(){
		super();
		this.list = new Object();
	}
	public add(columnName:string, value:any){
		if(this.getModel() && this.getModel().getColumn(columnName)) {
			this.list[columnName] = value;
		}
	}
	public getList():Object{
		return this.list;
	}
}
export = WhereQuery;