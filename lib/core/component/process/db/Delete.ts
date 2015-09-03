import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import NodeData = require("./../NodeData");
/**
 * Node zwraca obiekt z danym wpisem w bazie danych
 */
class Delete extends BaseDbNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Delete");
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addWhere(type: string, key?: string[]) {
		this.addMapSource("where", type, key);
	}
	protected promiseContent(data: NodeData): Util.Promise<any> {
		var deleteQuery = new Query.Delete();
		deleteQuery.setModel(this.getModel());
		deleteQuery.populateWhere(data.getMappedObject("where"));
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			deleteQuery.run()
			.then((model) => {
				resolve(null);
			});
		});
	}
}
export = Delete;