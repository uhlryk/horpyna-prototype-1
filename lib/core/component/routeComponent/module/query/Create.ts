import Model = require("../model/Model");
import BaseQuery = require("./BaseQuery");
import ValueQuery = require("./ValueQuery");
import Orm = require("../../../../util/Orm");
class Create extends BaseQuery{
	private valueQuery:ValueQuery;
	constructor(){
		super();
		this.valueQuery = new ValueQuery();
	}
	public setModel(model:Model){
		super.setModel(model);;
		this.valueQuery.setModel(this.getModel());
	}
	public value(columnName:string, value:any){
		this.valueQuery.add(columnName, value);
	}
	public populate(params:Object){
		this.valueQuery.populate(params);
	}
	public run():Orm.PromiseT<Orm.Instance<any,any>>{
		// super.run();
		return this.getModel().model.create(this.valueQuery.getList());
	}
}
export = Create;
