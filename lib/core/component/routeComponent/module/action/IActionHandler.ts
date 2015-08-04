import Response = require("./Response");
import Request = require("./Request");
import BaseAction = require("./BaseAction");
import Util = require("./../../../../util/Util");
interface IActionHandler {
	(request: Request, response: Response, action:BaseAction): Util.Promise<void>;
}
export = IActionHandler;