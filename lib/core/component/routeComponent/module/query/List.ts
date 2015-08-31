import Model = require("../model/Model");
import WhereQuery = require("./WhereQuery");
import BaseQuery = require("./BaseQuery");
import Orm = require("../../../../util/Orm");
class List extends BaseQuery{
	private _limit: number = 500;
	private _whereQuery:WhereQuery;
	private _pageSize: number;
	private _page: number;
	private _order: string[][];
	constructor(){
		super();
		this._order = [];
		this._whereQuery = new WhereQuery();

	}
	public setLimit(v:number){
		this._limit = v;
	}
	public getLimit():number{
		return this._limit;
	}
	public setModel(model:Model){
		super.setModel(model);;
		this._whereQuery.setModel(this.getModel());
	}
	public where(columnName:string, value:any){
		this._whereQuery.add(columnName, value);
	}
	public populateWhere(fields:Object){
		this._whereQuery.populate(fields);
	}
	public getWhereList():Object{
		return this._whereQuery.getList();
	}
	/**
	 * do order dodajemy dane w formie:
	 * nazwa kolumny, direction :asc | desc
	 */
	public addOrder(column:string, direction:string) {
		if ((direction === "desc" || direction === "asc") && this.getModel().getColumnNameList().indexOf(column) !== -1) {
			this._order.push([column, direction]);
		}
	}
	public getOrder():string[][]{
		if(this._order.length === 0){
			return [['id', 'desc']];
		} else{
			return this._order;
		}
	}
	public run():Orm.PromiseT<Orm.Instance<any,any>[]>{
		return this.getModel().model.findAll({
			attributes: this.getModel().getColumnNameList(),
			where:this._whereQuery.getList(),
			limit: this._limit + 1,//jeśli będzie o ten jeden więcej to wiemy że mamy więcej wyników w bazie niż max
			order: this.getOrder()
		});
	}
}
export = List;
