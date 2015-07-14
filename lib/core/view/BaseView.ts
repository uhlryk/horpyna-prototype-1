class BaseView{
	private expressResponse;
	private content:Object;
	private status:number;
	constructor(expressResponse){
		this.expressResponse = expressResponse;
		this.content = new Object();
	}
	public setStatus(value:number){
		this.status = value;
	}
	protected getStatus():number{
		return this.status;
	}
	public addValue(name:string, value:any){
		this.content[name] = value;
	}
	public addContentValue(value:any){
		this.content['content'] = value;
	}

	protected getContent():Object{
		return this.content;
	}
	protected getResponse(){
		return this.expressResponse;
	}
	public render(){
		this.expressResponse.status(this.status).send(this.content);
	}
}
export = BaseView;