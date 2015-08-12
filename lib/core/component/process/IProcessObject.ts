import Response = require("./../routeComponent/module/action/Response");
import Request = require("./../routeComponent/module/action/Request");
import Util = require("./../../util/Util");
import IConnection = require("./IConnection");
import BaseNode = require("./BaseNode");

interface IProcessObject{
	node: BaseNode;
	parentConnections: IConnection[];
	childrenConnections: IConnection[];
	resolver: (() => void);
	promise: Util.Promise<void>;
	response: any;
}
export = IProcessObject;