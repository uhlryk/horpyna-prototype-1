import BaseDbNode = require("./BaseDbNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
class List extends BaseDbNode {
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public where(type: string, key?: string[]) {
		this.addMapper("where", type, key);
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za sortowanie listy wartość musi być [<columnName>,<direction: ASC | DESC>]
	 * zignoruje te dane które nie spełniają kryterium
	 */
	public order(type:string, key?:string[]) {
		this.addMapper("order", type, key);
	}
	/**
	 * Używa tylko jednej wartości ale możemy dać wiele, wtedy w pętli pojedzie aż znajdzie jedną poprawną
	 */
	public page(type: string, key?: string[]){
		this.addMapper("page", type, key);
	}
	/**
	 * Używa tylko jednej wartości ale możemy dać wiele, wtedy w pętli pojedzie aż znajdzie jedną poprawną
	 */
	public size(type: string, key?: string[]){
		this.addMapper("size", type, key);
	}
	/**
	 * Przeszukuje zmapowane wartości dla numeru strony i wybiera jedną właściwą
	 */
	protected setPageValue(processEntry, request):number {
		var mappedObject = this.mapResponse("page", processEntry, request);
		var value;
		for (var key in mappedObject){
			var v = Number(mappedObject[key]);
			if (v > 0 && v < Query.List.MAX_DATA) {
				value = v;
				break;
			}
		}
		if(!value){
			value = 1;
		}
		return value
	}
	/**
	 * Przeszukuje zmapowane wartości dla ilości pozycji na stronie i wybiera jedną właściwą
	 */
	protected setPageSizeValue(processEntry, request): number {
		var mappedObject = this.mapResponse("size", processEntry, request);
		var value;
		for (var key in mappedObject) {
			var v = Number(mappedObject[key]);
			if (v > 0 && v < Query.List.MAX_DATA) {
				value = v;
				break;
			}
		}
		if (!value) {
			value = Query.List.DEFAULT_PAGE_SIZE;
		}
		return value;
	}
	/**
	 * z mapowania sortowania wyciąga wartości
	 */
	protected setOrderValue(processEntry, request): Object[] {
		var mappedObject = this.mapResponse("order", processEntry, request);
		var value = [];
		for (var key in mappedObject) {
			var v = mappedObject[key];
			if(v && v.length == 2){
				value.push(v);
			}
		}
		return value;
	}
	protected content(processEntryList: Object[], request: Request, response: Response): Util.Promise<Object> {
		var processEntry = processEntryList[0];
		var list = new Query.List();
		list.setModel(this.getModel());
		list.populateWhere(this.mapResponse("where", processEntry, request));
		list.setOrder(this.setOrderValue(processEntry, request));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			list.run()
			.then((modelList) => {
				var page = this.setPageValue(processEntry, request);
				var pageSize = this.setPageSizeValue(processEntry, request);
				var listResponse = [];
				var count = 0;
				for (var i = (page - 1) * pageSize; i < modelList.length; i++) {
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
					maxList: modelList.length
				});
			});
		});
	}
}
export = List;