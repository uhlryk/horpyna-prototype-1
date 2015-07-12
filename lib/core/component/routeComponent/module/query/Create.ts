import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");
class Create extends BaseQuery{
	private rawValues:Object;
	private values:Object;
	constructor(){
		super();
		this.rawValues = new Object();
		this.values = Object;
	}
	public addValue(columnName:string, value:any){
		this.rawValues[columnName] = value;
	}
	/**
	 * Otrzymane dane w formie {name1:value, name2:value} gdzie typ może być dowolny
	 * dodaje do kolumn i buduje rekord
	 * @param params
	 */
	public populate(params:Object){
		for (var name in params) {
			if(Object.prototype.hasOwnProperty.call(params, name)) {
				this.addValue(name, params[name]);
			}
		}
	}

	/**
	 * sprawdzamy które z dodanych kolumn istnieją w modelu
	 * tylko istniejące są dodawane do zbioru poprawnych wertości
	 */
	private filterModelColumn(){
		this.values = new Object();
		for (var columnName in this.rawValues) {
			if(Object.prototype.hasOwnProperty.call(this.rawValues, columnName)) {
				if(this.getModel() && this.getModel().getColumn(columnName)) {
					this.values[columnName] = this.rawValues[columnName];
				}
			}
		}
	}
	public run(){
		this.filterModelColumn();
		this.getModel().getModel().create(this.values);
	}
}
export = Create;
