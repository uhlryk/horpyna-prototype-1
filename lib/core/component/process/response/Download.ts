import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeData = require("./../NodeData");
/**
 * Ustawia by response wyświetlił/pobrał plik
 */
class Download extends BaseNode {
	private _action: BaseAction;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Download");
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedObject("entry_source");
		data.getActionResponse().setStatus(200);
		data.getActionResponse().setDownload(mappedEntry['path'], mappedEntry['name'], (err) => {

		});
		this.debug("show file: " + mappedEntry['path'] + " " + mappedEntry['name']);
		return null;
	}
}
export = Download;