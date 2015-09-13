import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import NodeData = require("./../NodeData");
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
	protected getPageValue(data: NodeData, limit: number): number {
		var value = Number(data.getMappedValue("page"));
		if (value < 1 || value > limit) {
			value = 1;
		}
		return value
	}
	/**
	 * Przeszukuje zmapowane wartości dla ilości pozycji na stronie i wybiera jedną właściwą
	 */
	protected getPageSizeValue(data: NodeData, limit: number): number {
		var value = Number(data.getMappedValue("size"));
		if (value < 1 || value > limit) {
			value = 1;
		}
		return value;
	}

	protected promiseContent(data: NodeData): Util.Promise<Object> {
		var list = new Query.List();
		list.setModel(this.getModel());
		list.populateWhere(data.getMappedObject("where"));
		list.addOrder(data.getMappedValue("order"), data.getMappedValue("direction"));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			list.run()
			.then((modelList) => {
				var page = this.getPageValue(data, list.getLimit());
				var pageSize = this.getPageSizeValue(data, list.getLimit());
				var listResponse = [];
				var count = 0;
				for (var i = (page - 1) * pageSize; i < modelList.length; i++) {
					if(!modelList[i]){
						continue;
					}
					var modelData = modelList[i].toJSON();
					listResponse.push(modelData);
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