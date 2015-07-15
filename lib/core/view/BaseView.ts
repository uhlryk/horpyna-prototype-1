class BaseView{
	private expressResponse;
	private data:Object;
	private status:number;
	constructor(expressResponse){
		this.expressResponse = expressResponse;
		this.data = new Object();
	}
	public setStatus(value:number){
		this.status = value;
	}
	protected getStatus():number{
		return this.status;
	}
	public setData(value:any){
		this.data = value;
	}
	public getData():Object{
		return this.data;
	}
	protected getResponse(){
		return this.expressResponse;
	}
	public render(){
		this.expressResponse.status(this.status).send(this.data);
	}
}
export = BaseView;