import BaseEvent = require("../BaseEvent");
var TYPE_NAME = "Action.OnReady";

export class Publisher extends BaseEvent.Publisher{
	constructor(){
		super(TYPE_NAME);
		var data = this.getRawData();
		data["query"] = Object;
		data["params"] = Object;
		data["body"] = Object;
		this.responseObject = Response;
	}
	public setQuery(query:Object){
		var data = this.getRawData();
		data["params"] = query;
	}
	public setParams(params:Object){
		var data = this.getRawData();
		data["params"] = params;
	}
	public setBody(body:Object){
		var data = this.getRawData();
		data["body"] = body;
	}
}
export class Subscriber extends BaseEvent.Subscriber{
	constructor(){
		super(TYPE_NAME);
		this.dataObject = Data;
	}
}
export class Data extends BaseEvent.Data{
	public getQuery():Object{
		var data = this.getRawData();
		return data["params"];
	}
	public getParams():Object{
		var data = this.getRawData();
		return data["params"];
	}
	public getBody():Object{
		var data = this.getRawData();
		return data["body"];
	}
}
export class Response extends BaseEvent.Response{}