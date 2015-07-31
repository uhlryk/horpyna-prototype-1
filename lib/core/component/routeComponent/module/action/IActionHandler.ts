import Response = require("./Response");
import Request = require("./Request");
import Util = require("./../../../../util/Util");
interface IActionHandler {
	(request: Request, response: Response): Util.Promise<void>;
}
export = IActionHandler;