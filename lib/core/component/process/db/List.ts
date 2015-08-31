import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
class List extends BaseDbNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:List");
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addWhere(type: string, key?: string[]) {
		this.addMapSource("where", type, key);
	}

	public setOrder(type:string, key:string) {
		this.setMapSource("order", type, key);
	}
	public setDirection(type:string, key:string) {
		this.setMapSource("direction", type, key);
	}
	/**
	 * Używa tylko jednej wartości ale możemy dać wiele, wtedy w pętli pojedzie aż znajdzie jedną poprawną
	 */
	public setPage(type: string, key: string){
		this.setMapSource("page", type, key);
	}
	/**
	 * Używa tylko jednej wartości ale możemy dać wiele, wtedy w pętli pojedzie aż znajdzie jedną poprawną
	 */
	public setSize(type: string, key: string) {
		this.setMapSource("size", type, key);
	}
	/**
	 * Przeszukuje zmapowane wartości dla numeru strony i wybiera jedną właściwą
	 */
	protected getPageValue(processEntryList: Object[], request, limit: number): number {
		var value = Number(this.getMappedValue("page", processEntryList, request));
		if (value < 0 || value > limit) {
			value = 0;
		}
		return value
	}
	/**
	 * Przeszukuje zmapowane wartości dla ilości pozycji na stronie i wybiera jedną właściwą
	 */
	protected getPageSizeValue(processEntryList: Object[], request, limit:number): number {
		var value = Number(this.getMappedValue("size", processEntryList, request));
		if (value < 1 || value > limit) {
			value = 1;
		}
		return value;
	}

	protected content(processEntryList: Object[], request: Request, response: Response): Util.Promise<Object> {
		var list = new Query.List();
		list.setModel(this.getModel());
		list.populateWhere(this.getMappedObject("where", processEntryList, request));
		list.addOrder(this.getMappedValue("order", processEntryList, request), this.getMappedValue("direction", processEntryList, request));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			list.run()
			.then((modelList) => {
				var page = this.getPageValue(processEntryList, request, list.getLimit());
				var pageSize = this.getPageSizeValue(processEntryList, request, list.getLimit());
				var listResponse = [];
				var count = 0;
				for (var i = (page - 1) * pageSize; i < modelList.length; i++) {
					if(!modelList[i]){
						continue;
					}
					var data = modelList[i].toJSON();
					listResponse.push(data);
					count++;
					if (count > pageSize){
						break;
					}
				}
				resolve({
					list: listResponse,
					page: page,
					size: pageSize,
					allSize: modelList.length,
					maxSize: list.getLimit()
				});
			})
		});
	}
}
export = List;