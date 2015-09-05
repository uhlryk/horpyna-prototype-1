import BaseEvent = require("../BaseEvent");


class OnUnvalid extends BaseEvent{
	public static EVENT_NAME = "Action.OnUnvalid";
	constructor(publicEvent?: boolean) {
		super(OnUnvalid.EVENT_NAME, publicEvent);
	}
}
export = OnUnvalid;