import Model = require("../model/Model");
import WhereQuery = require("./WhereQuery");
import BaseQuery = require("./BaseQuery");
import Orm = require("../../../../util/Orm");
class List extends BaseQuery{
	public static MAX_DATA: number = 500;
	public static MAX_PAGES: number = 5;
	public static DEFAULT_PAGE_SIZE: number = 3;
	private whereQuery:WhereQuery;
	private _pageSize: number;
	private _page: number;
	private _order: string[][];
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
	/**
	 * do order dodajemy dane w formie:
	 * [[<NazwaKolumna>,<Direction ASC|DESC>]]
	 */
	public setOrder(order: string[][]) {
		this._order = order;
	}
	public getOrder():string[][]{
		var order: string[][] = [];
		if (this._order){
			for (var i = 0; i < this._order.length; i++){
				var pair:string[] = this._order[i];
				if (pair[0]){
					if (!pair[1]){
						pair[1] = "DESC";
					}
					order.push(pair);
				}
			}
		}
		if(order.length === 0){
			order = [['id', 'DESC']];
		}
		return order;
	}
	public run():Orm.PromiseT<Orm.Instance<any,any>[]>{
		return this.getModel().model.findAll({
			attributes: this.getModel().getColumnNameList(),
			where:this.whereQuery.getList(),
			limit: List.MAX_DATA+1,//jeśli będzie o ten jeden więcej to wiemy że mamy więcej wyników w bazie niż max
			order: this.getOrder()
		});
	}
}
export = List;
