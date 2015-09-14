import BaseEventListener = require("../BaseEventListener");
import Core = require("./../../../../index");

class OnBegin extends BaseEventListener {
	public static EVENT_NAME = "Dispatcher.OnBegin";
	constructor(parent: Core.Module, name: string, publicEvent?: boolean) {
		super(parent, name, OnBegin.EVENT_NAME, publicEvent);
	}
}
export = OnBegin;