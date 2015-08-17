import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
class List extends BaseDbNode {
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
	protected setPageValue(processEntryList: Object[], request): number {
		// var mappedObject = this.mapResponse("page", processEntry, request);
		// for (var key in mappedObject){
		// 	var v = Number(mappedObject[key]);
		// 	if (v > 0 && v < Query.List.MAX_DATA) {
		// 		value = v;
		// 		break;
		// 	}
		// }
		var value = Number(this.getMappedValue("page", processEntryList, request));
		if(!value){
			value = 1;
		}
		return value
	}
	/**
	 * Przeszukuje zmapowane wartości dla ilości pozycji na stronie i wybiera jedną właściwą
	 */
	protected setPageSizeValue(processEntryList: Object[], request): number {
		// var mappedObject = this.mapResponse("size", processEntry, request);
		// var value;
		// for (var key in mappedObject) {
		// 	var v = Number(mappedObject[key]);
		// 	if (v > 0 && v < Query.List.MAX_DATA) {
		// 		value = v;
		// 		break;
		// 	}
		// }
		var value = Number(this.getMappedValue("size", processEntryList, request));
		if (value > 0 && value < Query.List.MAX_DATA) {
			value = 0;
		}
		if (!value) {
			value = Query.List.DEFAULT_PAGE_SIZE;
		}
		return value;
	}
	protected content(processEntryList: Object[], request: Request, response: Response): Util.Promise<Object> {
		var list = new Query.List();
		list.setModel(this.getModel());
		list.populateWhere(this.getMappedObject("where", processEntryList, request));
		list.setOrder([[this.getMappedValue("order", processEntryList, request), this.getMappedValue("order", processEntryList, request)]]);
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			list.run()
			.then((modelList) => {
				var page = this.setPageValue(processEntryList, request);
				var pageSize = this.setPageSizeValue(processEntryList, request);
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
			})
		});
	}
}
export = List;