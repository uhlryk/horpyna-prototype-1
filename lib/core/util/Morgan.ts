var morgan = require('morgan');

class Morgan{
	private _handler;
	constructor(type:string, loggerStream:any){
		this._handler = morgan(type, { stream: loggerStream });
	}
	public get handler(){
		return this._handler;
	}
}
export = Morgan;