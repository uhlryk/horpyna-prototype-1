import BaseEvent = require("../BaseEvent");
var TYPE_NAME = "OnStartAction";
/**
 * Event odpala się na początku akcji
 * Jeśli subskrybent
 */
export class Publisher extends BaseEvent.Publisher{
	constructor(){
		super(TYPE_NAME);
		var data = this.getRawData();
		data["allow"] = true;
		this.responseObject = Response;
	}
}
export class Subscriber extends BaseEvent.Subscriber{
	constructor(){
		super(TYPE_NAME);
		this.dataObject = Data;
	}
}
export class Data extends BaseEvent.Data{
	public allow(access:boolean){
		var data = this.getRawData();
		if(data["allow"] === true){
			data["allow"] = access;
		}
	}
}
export class Response extends BaseEvent.Response{
	public isAllow():boolean{
		var data = this.getRawData();
		return data["allow"];
	}
}