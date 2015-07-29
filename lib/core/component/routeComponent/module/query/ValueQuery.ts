import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");
/**
 * Funkcja dodawana do Query przez kompozycję, odpowiada za wartości kolumn dla Insert czy Update. Dodawana przez kompozycję
 */
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
	 * @param fields
	 */
	public populate(fields:Object){
		for (var name in fields) {
			if(Object.prototype.hasOwnProperty.call(fields, name)) {
				this.add(name, fields[name]);
			}
		}
	}
	public getList():Object{
		return this.list;
	}
}
export = ValueQuery;
