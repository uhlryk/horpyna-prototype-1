import BaseEventListener = require("../BaseEventListener");
import Core = require("./../../../../index");

class OnReady extends BaseEventListener{
	public static EVENT_NAME = "Action.OnReady";
	constructor(parent: Core.Module, name: string, publicEvent?: boolean) {
		super(parent, name, OnReady.EVENT_NAME, publicEvent);
	}
}
export = OnReady;