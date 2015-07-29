import Model = require("../model/Model");
import WhereQuery = require("./WhereQuery");
import BaseQuery = require("./BaseQuery");
import Orm = require("../../../../util/Orm");
class List extends BaseQuery{
	private whereQuery:WhereQuery;
	constructor(){
		super();
		this.whereQuery = new WhereQuery();
	}
	public setModel(model:Model){
		super.setModel(model);;
		this.whereQuery.setModel(this.getModel());
	}
	public where(columnName:string, value:any){
		this.whereQuery.add(columnName, value);
	}
	public populateWhere(fields:Object){
		this.whereQuery.populate(fields);
	}
	public getWhereList():Object{
		return this.whereQuery.getList();
	}
	public run():Orm.PromiseT<Orm.Instance<any,any>[]>{
		// super.run();
		return this.getModel().model.findAll({
			attributes: this.getModel().getColumnNameList(),
			where:this.whereQuery.getList()
		});
	}
}
export = List;
