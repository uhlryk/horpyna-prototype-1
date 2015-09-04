import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import NodeData = require("./../NodeData");
/**
 * Node tworzy nowy node w bazie danych
 */
class Update extends BaseDbNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Update");
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addData(sourceType: string, key?: string[]) {
		this.addMapSource("data", sourceType, key);
	}
	public addWhere(type: string, key?: string[]) {
		this.addMapSource("where", type, key);
	}
	protected promiseContent(data: NodeData): Util.Promise<any> {
		var update = new Query.Update();
		update.setModel(this.getModel());
		var popuplateData = data.getMappedObject("data");
		var whereData = data.getMappedObject("where");
		console.log("Z1 popuplateData");
		console.log(popuplateData);
		console.log("Z2 whereData");
		console.log(whereData);
		console.log("Z3");
		update.populate(popuplateData);
		update.populateWhere(whereData);
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			update.run()
			.then((model) => {
				resolve(null);
			});
		});
	}
}
export = Update;