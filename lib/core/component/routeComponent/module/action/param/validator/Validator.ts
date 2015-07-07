import Component = require("../../../../../Component");
/**
 * Definiuje walidator dla pojedyńczego parametru
 */
class Validator extends Component {

	constructor(name:string){
		super(name);
	}
	public init():void{
		this.onInit();
	}
	protected onInit():void{

	}

}
export  = Validator;
