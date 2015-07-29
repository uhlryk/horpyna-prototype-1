import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");
/**
 * Funkcjonalność dodawana do Query przez kompozycję. Odpowiada za warunek WHERE w sql query
 */
class WhereQuery extends BaseQuery{
	private list:Object;
	constructor(){
		super();
		this.list = new Object();
	}
	public add(columnName:string, value:any){
		if (this.getModel() && (columnName === 'id' || this.getModel().getColumn(columnName))) {
			this.list[columnName] = value;
		}
	}
	public populate(fields){
		for (var name in fields) {
			this.add(name, fields[name]);
		}
	}
	public getList():Object{
		return this.list;
	}
}
export = WhereQuery;