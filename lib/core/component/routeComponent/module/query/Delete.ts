import Model = require("../model/Model");
import WhereQuery = require("./WhereQuery");
import BaseQuery = require("./BaseQuery");
import Orm = require("../../../../util/Orm");
class Delete extends BaseQuery{
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
	public run():Orm.Promise{
		return this.getModel().getModel().destroy({
			where:this.whereQuery.getList()
		});
	}
}
export = Delete;