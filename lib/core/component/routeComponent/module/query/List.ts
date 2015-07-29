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
	private _order: Object[];
	constructor(){
		super();
		this.whereQuery = new WhereQuery();
		// this._pageSize = 3;
		// this._page = 1;
		this._order = [['id', 'DESC']];
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
	// public setPageSize(pageSize:number){
	// 	if (pageSize) {
	// 		if (pageSize < 1) pageSize = 1;
	// 		this._pageSize = pageSize;
	// 	}
	// }
	// public setPage(page:number){
	// 	if (page) {
	// 		if (page < 1) page = 1;
	// 		this._page = page;
	// 	}
	// }
	public setOrder(order: Object[]) {
		if(order){
			this._order = order;
		}
	}
	public run():Orm.PromiseT<Orm.Instance<any,any>[]>{
		return this.getModel().model.findAll({
			attributes: this.getModel().getColumnNameList(),
			where:this.whereQuery.getList(),
			limit: List.MAX_DATA+1,//jeśli będzie o ten jeden więcej to wiemy że mamy więcej wyników w bazie niż max
			// limit: this._pageSize,
			// offset: (this._page - 1) * this._pageSize,
			order: this._order
		});
	}
}
export = List;
