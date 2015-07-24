import Response = require("./Response");
import Request = require("./Request");
interface IActionHandler {
	(request: Request, response: Response, done: () => void): void;
}
export = IActionHandler;