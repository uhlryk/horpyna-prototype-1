import BaseEvent = require("../BaseEvent");
var TYPE_NAME = "OnAction";

export class Publisher extends BaseEvent.Publisher{
	constructor(){
		super(TYPE_NAME);
		this.responseObject = Response;
	}
}
export class Subscriber extends BaseEvent.Subscriber{
	constructor(){
		super(TYPE_NAME);
		this.dataObject = Data;
	}
}
export class Data extends BaseEvent.Data{}
export class Response extends BaseEvent.Response{}