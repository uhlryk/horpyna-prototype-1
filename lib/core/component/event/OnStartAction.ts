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
	}
}
export class Subscriber extends BaseEvent.Subscriber{
	constructor(){
		super(TYPE_NAME);
		this.responseObject = Data;
	}
}
export class Data extends BaseEvent.Data{
	constructor(rawData:any){
		super(TYPE_NAME, rawData);
	}
	public allow(access:boolean){
		var data:boolean = this.getRawData();
		if(data === true){
			data = access;
		}
		this.setRawData(data);
	}
}
export class Response extends BaseEvent.Response{
	constructor(rawData:any){
		super(TYPE_NAME, rawData);
	}
	public isAllow():boolean{
		return this.getRawData();
	}
}