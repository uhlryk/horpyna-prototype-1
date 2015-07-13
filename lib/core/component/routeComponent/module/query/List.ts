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
	public getWhereList():Object{
		return this.whereQuery.getList();
	}
	public run():Orm.PromiseT<Orm.Instance<any,any>[]>{
		return this.getModel().getModel().findAll({
			where:this.whereQuery.getList()
		});
	}
}
export = List;
