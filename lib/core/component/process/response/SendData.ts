import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import ProcessModel = require("./../ProcessModel");
class SendData extends BaseNode{
	private _view: string;
	private _key: string;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:SendData");
	}
	public setView(v:string){
		this._view = v;
	}
	public setResponseKey(v: string){
		this._key = v;
	}
	protected content(processEntryList: any[], request: Request, response: Response, processList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (processResponse: any) => void) => {
			this.debug("begin");
			var mappedEntry = this.getMappedEntry(processEntryList, request);
			this.debug(mappedEntry);
			response.addValue(this._key || "content", mappedEntry);
			response.view = this._view;
			this.debug("null");
			resolve(null);
		});
	}
}
export = SendData;