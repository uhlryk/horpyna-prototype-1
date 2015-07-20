import BaseEvent = require("../BaseEvent");

class OnFinish extends BaseEvent {
	public static EVENT_NAME = "Action.OnFinish";
	constructor(publicEvent?: boolean) {
		super(OnFinish.EVENT_NAME, publicEvent);
	}
}
export = OnFinish;