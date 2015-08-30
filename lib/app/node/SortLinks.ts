import Core = require("../../index");
/**
 * Generuje Linki nawigacyjne na podstawie tablicy obiektów (tworzy unikalne klucze do każdego obiektu) a potem tworzy linki z nawigacją
 */
class SortLinks extends Core.Node.BaseNode {
	private _action: Core.Action.BaseAction;
	private static DEFAULT_DIRECTION: string = "asc";
	private static REVERSE_DIRECTION: string = "desc";
	constructor(parentNodeList:Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.addMapSource("action_param", Core.Action.FieldType.PARAM_FIELD);
		this.addMapSource("action_query", Core.Action.FieldType.QUERY_FIELD);
		this.initDebug("node:SortLinks");
	}
	public setAction(action: Core.Action.BaseAction) {
		this._action = action;
	}
	protected innerContent(processEntryList: any[], actionRequest: Core.Action.Request, actionResponse: Core.Action.Response, processObjectList): any {
		this.debug("begin");
		if (this._action) {
			var mappedEntry = this.getMappedEntry(processEntryList, actionRequest);
			this.debug(mappedEntry);
			var keyList = [];
			for (var i = 0; i < mappedEntry.length; i++) {
				var row = mappedEntry[i];
				for (var key in row) {
					if (keyList.indexOf(key) === -1){
						keyList.push(key);
					}
				}
			}
			var processResponse = [];
			var actionParam = this.getMappedObject("action_param", processEntryList, actionRequest);
			var actionQuery = this.getMappedObject("action_query", processEntryList, actionRequest);
			var actDirection = actionQuery["d"];
			var actKey = actionQuery["o"];
			for (var i = 0; i < keyList.length; i++) {
				var element = new Object();
				var key = keyList[i];
				if (key !== actKey) {
					actionQuery["d"] = SortLinks.DEFAULT_DIRECTION;
				} else if (actDirection === SortLinks.REVERSE_DIRECTION) {
					actionQuery["d"] = SortLinks.DEFAULT_DIRECTION;
				} else {
					actionQuery["d"] = SortLinks.REVERSE_DIRECTION;
				}
				actionQuery["o"] = key;
				element["uri"] = this._action.populateRoutePathWithQuery(actionParam, actionQuery);
				element["name"] = key;
				processResponse.push(element);
			}
		}
		this.debug(processResponse);
		return processResponse;
	}
}
export = SortLinks;