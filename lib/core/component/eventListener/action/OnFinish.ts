import BaseEventListener = require("../BaseEventListener");
import Core = require("./../../../../index");
class OnFinish extends BaseEventListener {
	public static EVENT_NAME = "Action.OnFinish";
	constructor(parent: Core.Module, name: string, publicEvent?: boolean) {
		super(parent, name, OnFinish.EVENT_NAME, publicEvent);
	}
}
export = OnFinish;