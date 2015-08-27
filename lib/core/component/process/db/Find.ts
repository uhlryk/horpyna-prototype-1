import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
/**
 * Node zwraca obiekt z danym wpisem w bazie danych
 */
class Find extends BaseDbNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Find");
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addWhere(type: string, key?: string[]) {
		this.addMapSource("where", type, key);
	}
	protected content(processEntryList: Object[], request: Request, response: Response): Util.Promise<any> {
		var find = new Query.Find();
		find.setModel(this.getModel());
		find.populateWhere(this.getMappedObject("where", processEntryList, request));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
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