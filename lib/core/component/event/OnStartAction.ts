import BaseEvent = require("./BaseEvent");
var TYPE_NAME = "OnStartAction";
/**
 * Event odpala się na początku akcji
 * Jeśli subskrybent
 */
export class Publisher extends BaseEvent.Publisher{
	constructor(){
		super(TYPE_NAME);
		var data:boolean=true;
		this.setRawData(data);
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
		var data:boolean = this.getRawData();
		if(data === true){
			data = access;
		}
		this.setRawData(data);
	}
}
export class Response extends BaseEvent.Response{
	public isAllow():boolean{
		return this.getRawData();
	}
}