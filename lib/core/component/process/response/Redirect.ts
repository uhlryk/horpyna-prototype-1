import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import FieldType = require("./../../routeComponent/module/action/field/FieldType");
/**
 * Ustawia w odpowiedzi przekierowanie
 */
class Redirect extends BaseNode {
	private _action: BaseAction;
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
	public sourceTargetParams(type: string, key?: string[]) {
		this.addMapper("params", type, key);
	}
	private _url: string;
	/**
	 * Zamiast akcji możemy wskazać url przekierowania
	 */
	public setTargetUrl(v: string) {
		this._url = v;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processList: IProcessObject[]): Util.Promise<any> {
		console.log("A1");
		var processEntry = processEntryList[0];
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
		console.log("A2");
			if(this._action){
				var params = this.mapResponse("params", processEntry, request);
				if (params){
					response.setRedirect(this._action.populateRoutePath(params));
				} else {
					response.setRedirect(this._action.getRoutePath(false));
				}
			} else {
				response.setRedirect(this._url || "/");
			}
		console.log("A3");
			resolve(null);
		});
	}
}
export = Redirect;