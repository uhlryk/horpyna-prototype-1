import BaseEvent = require("../BaseEvent");


class OnReady extends BaseEvent{
	public static EVENT_NAME = "Action.OnReady";
	constructor(publicEvent?: boolean) {
		super(OnReady.EVENT_NAME, publicEvent);
	}
}
export = OnReady;