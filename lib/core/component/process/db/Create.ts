import BaseDbNode = require("./BaseDbNode");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import NodeData = require("./../NodeData");
/**
 * Node tworzy nowy node w bazie danych
 */
class Create extends BaseDbNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Create");
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addData(sourceType: string, key?: string[]) {
		this.addMapSource("data", sourceType, key);
	}
	protected promiseContent(data: NodeData): Util.Promise<any> {
		var create = new Query.Create();
		create.setModel(this.getModel());
		var popuplateData = data.getMappedObject("data");
		create.populate(popuplateData);
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			create.run()
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
export = Create;