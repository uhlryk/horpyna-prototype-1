import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import Util = require("./../../util/Util");

interface IProcessObject{
	allow: boolean;
	resolver: ((response: any) => void);
	promise: Util.Promise<any>;
	response: any;
}
export = IProcessObject;