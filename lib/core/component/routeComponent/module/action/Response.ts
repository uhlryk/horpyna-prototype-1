class ActionHandlerResponse{
	public content:Object;
	public status:number;
	constructor(){
		this.content = new Object();
		this.status = 200;
	}
	public setContent(value:any){this.content = value;}
	public getContent():any{return this.content;}
	public setStatus(value:number){this.status = value;}
	public getStatus():number{return this.status;}

}
export = ActionHandlerResponse;