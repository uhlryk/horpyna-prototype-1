import Component = require("../../../../Component");
class Column extends Component{
	constructor(name:string){
		super(name);
	}
	public init():void{
		this.onInit();
	}
	protected onInit(){

	}
}
export = Column;