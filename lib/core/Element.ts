import Util = require("./util/Util");
class Element{
	private static _logger: Util.Logger = new Util.Logger();
	public get logger(): Util.Logger {
		return Element._logger;
	}
}
export = Element;