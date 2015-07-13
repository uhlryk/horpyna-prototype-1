import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");
class ValueQuery extends BaseQuery{
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
	/**
	 * Otrzymane dane w formie {name1:value, name2:value} gdzie typ może być dowolny
	 * dodaje do kolumn i buduje rekord
	 * @param params
	 */
	public populate(params:Object){
		for (var name in params) {
			if(Object.prototype.hasOwnProperty.call(params, name)) {
				this.add(name, params[name]);
			}
		}
	}
	public getList():Object{
		return this.list;
	}
}
export = ValueQuery;
