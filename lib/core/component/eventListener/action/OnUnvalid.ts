import BaseEventListener = require("../BaseEventListener");
import Core = require("./../../../../index");

class OnUnvalid extends BaseEventListener{
	public static EVENT_NAME = "Action.OnUnvalid";
	constructor(parent: Core.Module, name: string, publicEvent?: boolean) {
		super(parent, name, OnUnvalid.EVENT_NAME, publicEvent);
	}
}
export = OnUnvalid;