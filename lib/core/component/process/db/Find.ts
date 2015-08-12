import BaseDbNode = require("./BaseDbNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
/**
 * Node zwraca obiekt z danym wpisem w bazie danych
 */
class Find extends BaseDbNode {
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public where(type: string, key?: string[]) {
		this.addMapper("where", type, key);
	}
	protected content(processEntryList: Object[], request: Request, response: Response): Util.Promise<Object> {
		var processEntry = processEntryList[0];
		var find = new Query.Find();
		find.setModel(this.getModel());
		find.populateWhere(this.mapResponse("where", processEntry, request));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			find.run()
			.then((model) => {
				if (model) {
					var data = model.toJSON();
					resolve(data);
				} else {
					resolve(null);
				}
			});
		});
	}
}
export = Find;