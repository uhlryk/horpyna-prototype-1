import BaseEvent = require("../BaseEvent");

class OnBegin extends BaseEvent {
	public static EVENT_NAME = "Action.OnBegin";
	constructor(publicEvent?: boolean) {
		super(OnBegin.EVENT_NAME, publicEvent);
	}
}
export = OnBegin;