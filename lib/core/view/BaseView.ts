class BaseView{
	private expressResponse;
	private _data:Object;
	private _param:Object;
	private _status:number;
	constructor(expressResponse){
		this.expressResponse = expressResponse;
		this._data = new Object();
		this._param = new Object();
	}
	public set status(value:number){
		this._status = value;
	}
	public get status():number{
		return this._status;
	}
	public set data(value: Object) {
		this._data = value;
	}
	public get data():Object{
		return this._data;
	}
	public set param(value: Object) {
		this._param = value;
	}
	public get param(): Object {
		return this._param;
	}
	protected getResponse(){
		return this.expressResponse;
	}
	public render(){

	}
}
export = BaseView;