import Component = require("../../../../Component");
class Column extends Component{
	//public static DataType:Column;
	constructor(name:string, type:string){
		super(name);
	}
	public init():void{
		this.onInit();
	}
	protected onInit(){

	}
}
export = Column;