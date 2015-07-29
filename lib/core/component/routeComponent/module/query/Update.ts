import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");
import ValueQuery = require("./ValueQuery");
import WhereQuery = require("./WhereQuery");
import Orm = require("../../../../util/Orm");
class Update extends BaseQuery{
	private valueQuery:ValueQuery;
	private whereQuery:WhereQuery;
	constructor(){
		super();
		this.valueQuery = new ValueQuery();
		this.whereQuery = new WhereQuery();
	}
	public setModel(model:Model){
		super.setModel(model);;
		this.valueQuery.setModel(this.getModel());
		this.whereQuery.setModel(this.getModel());
	}
	public value(columnName:string, value:any){
		this.valueQuery.add(columnName, value);
	}
	public where(columnName:string, value:any){
		this.whereQuery.add(columnName, value);
	}
	public populate(fields:Object){
		this.valueQuery.populate(fields);
	}
	public populateWhere(fields:Object){
		this.whereQuery.populate(fields);
	}
	public run():Orm.Promise{
		// super.run();
		return this.getModel().model.update(this.valueQuery.getList(),{where:this.whereQuery.getList()});
	}
}
export = Update;
