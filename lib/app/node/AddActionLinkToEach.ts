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
	protected content(processEntryList: any[], actionRequest: Core.Action.Request, actionResponse: Core.Action.Response, processObjectList): Core.Util.Promise<any> {
		return new Core.Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, actionRequest);
			this.debug(mappedEntry);
			for (var i = 0; i < mappedEntry.length; i++) {
				for (var j = 0; j < this.getActionList().length; j++) {
					var oneEntry = mappedEntry[i];
					if(oneEntry[this._key] === undefined){
						oneEntry[this._key] = []
					}
					oneEntry[this._key].push(this.createUri(this.getActionList()[j], oneEntry, processEntryList, actionRequest));
				}
			}
			this.debug(mappedEntry);
			resolve(mappedEntry);
		});
	}
}
export = AddActionLinkToEach;