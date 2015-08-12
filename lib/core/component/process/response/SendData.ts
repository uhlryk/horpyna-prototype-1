import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
class SendData extends BaseNode{
	private _view: string;
	private _key: string;
	public setView(v:string){
		this._view = v;
	}
	public setResponseKey(v: string){
		this._key = v;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			console.log("B1");
			console.log(processEntryList[0]);
			console.log("B2");
			response.addValue(this._key || "content", processEntryList[0]);
			response.view = this._view;
			resolve(null);
		});
	}
}
export = SendData;