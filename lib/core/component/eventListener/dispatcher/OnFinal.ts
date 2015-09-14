import BaseEventListener = require("../BaseEventListener");
import Core = require("./../../../../index");

class OnFinal extends BaseEventListener {
	public static EVENT_NAME = "Dispatcher.OnFinal";
	constructor(parent: Core.Module, name: string, publicEvent?: boolean) {
		super(parent, name, OnFinal.EVENT_NAME, publicEvent);
	}
}
export = OnFinal;