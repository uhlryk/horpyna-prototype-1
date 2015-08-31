import Core = require("../../index");
/**
 * Do listy obiektów np wyników z bazy danych dodaje do każdego z elementów akcje które są wypełnione danymi
 * z tego elementu
 */
class AddActionLinkToEach extends Core.Node.Transform.ActionLink {
	private _key: string;
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:AddActionLinkToEach");
		this._key = "nav";
	}
	/**
	 * wskazujemy klucz jaki ma mieć lista linków przy każdym elemencie
	 */
	public setKey(v: string) {
		this._key = v;
	}
	protected content(data: Core.Node.NodeData): any {
		this.debug("begin");
		var mappedEntry = data.getMappedEntry();
		this.debug(mappedEntry);
		for (var i = 0; i < mappedEntry.length; i++) {
			for (var j = 0; j < this.getActionList().length; j++) {
				var oneEntry = mappedEntry[i];
				if(oneEntry[this._key] === undefined){
					oneEntry[this._key] = []
				}
				oneEntry[this._key].push(this.createUri(this.getActionList()[j], oneEntry, data));
			}
		}
		this.debug(mappedEntry);
		return mappedEntry;
	}
}
export = AddActionLinkToEach;