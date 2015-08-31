import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeData = require("./../NodeData");
/**
 * Ustawia w odpowiedzi przekierowanie
 */
class Redirect extends BaseNode {
	private _action: BaseAction;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:Redirect");
	}
	/**
	 * wskazujemy akcję do której ma być redirect
	 * @param {BaseAction} v [description]
	 */
	public setTargetAction(v: BaseAction) {
		this._action = v;
	}
	/**
	 * Jeśli akcja ma parametry to wskazujemy z jakiego źródła ma stworzyć obiekt do populate params
	 */
	public mapTargetParams(type: string, key?: string[]) {
		this.addMapSource("params", type, key);
	}
	private _url: string;
	/**
	 * Zamiast akcji możemy wskazać url przekierowania
	 */
	public setTargetUrl(v: string) {
		this._url = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var uri;
		if(this._action){
			var params = data.getMappedObject("params");
			if (params){
				uri = this._action.populateRoutePath(params);
			} else {
				uri = this._action.getRoutePath(false);
			}
		} else {
			uri = this._url || "/";
		}
		data.getActionResponse().setRedirect(uri);
		this.debug("redirect: " + uri);
		return null;
	}
}
export = Redirect;