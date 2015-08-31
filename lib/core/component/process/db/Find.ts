import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import NodeData = require("./../NodeData");
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
	protected promiseContent(data: NodeData): Util.Promise<any> {
		var find = new Query.Find();
		find.setModel(this.getModel());
		find.populateWhere(data.getMappedObject("where"));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			find.run()
			.then((model) => {
				if (model) {
					var modelData = model.toJSON();
					resolve(modelData);
				} else {
					resolve(null);
				}
			});
		});
	}
}
export = Find;