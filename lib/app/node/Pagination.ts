import Core = require("../../index");
/**
 * Generuje Linki nawigacyjne
 */
class Pagination extends Core.Node.BaseNode {
	private _action: Core.Action.BaseAction;
	private static DEFAULT_DIRECTION: string = "asc";
	private static REVERSE_DIRECTION: string = "desc";
	/**
	 * Ile numerów stron pojawi się z każdego kierunku od aktualnej strony
	 * @type {Number}
	 */
	private _areaPages = 5;
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.addMapSource("action_param", Core.Node.SourceType.PARAM_FIELD);
		this.addMapSource("action_query", Core.Node.SourceType.QUERY_FIELD);
		this.initDebug("node:Pagination");
	}
	public setAction(action: Core.Action.BaseAction) {
		this._action = action;
	}
	public setPage(type: string, key: string){
		this.setMapSource("page", type, key);
	}
	public setSize(type: string, key: string) {
		this.setMapSource("size", type, key);
	}
	public setAllSize(type: string, key: string) {
		this.setMapSource("all_size", type, key);
	}
	protected content(data: Core.Node.NodeData): any {
		this.debug("begin");
		var processResponse = [];
		if (this._action) {
			var actionParam = data.getMappedObject("action_param");
			var actionQuery = data.getMappedObject("action_query");
			var allSize = (data.getMappedValue("all_size"));
			var page = Number(data.getMappedValue("page"));
			var pageSize = Number(data.getMappedValue("size"));
			var pagesNumber = Math.ceil(allSize / pageSize);
			actionQuery['s'] = pageSize;
			if(page > 0){//pojawi się link first i previous
				var firstElement = new Object();
				actionQuery['p'] = 0;
				firstElement["uri"] = this._action.populateRoutePathWithQuery(actionParam, actionQuery);
				firstElement["name"] = "first";
				firstElement["type"] = "first";
				processResponse.push(firstElement);
				var previousElement = new Object();
				actionQuery['p'] = page - 1;
				previousElement["uri"] = this._action.populateRoutePathWithQuery(actionParam, actionQuery);
				previousElement["name"] = "previous";
				previousElement["type"] = "previous";
				processResponse.push(previousElement);
			}
			var iStart = page - this._areaPages;
			var iEnd = page + this._areaPages;
			if (iStart < 0) {
				iStart = 0;
			}
			if (iEnd > pagesNumber){
				iEnd = pagesNumber;
			}

				for (; iStart < iEnd; iStart++) {
					if (iStart !== page) {
						var numElement = new Object();
						actionQuery['p'] = iStart;
						numElement["uri"] = this._action.populateRoutePathWithQuery(actionParam, actionQuery);
						numElement["name"] = iStart + 1;
						numElement["type"] = "num";
						processResponse.push(numElement);
					}
				}

			if (page < pagesNumber-1){
				var previousElement = new Object();
				actionQuery['p'] = page + 1;
				previousElement["uri"] = this._action.populateRoutePathWithQuery(actionParam, actionQuery);
				previousElement["name"] = "next";
				previousElement["type"] = "next";
				processResponse.push(previousElement);
			}
		}
		this.debug(processResponse);
		return processResponse;
	}
}
export = Pagination;