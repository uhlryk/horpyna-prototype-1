import Component = require("../../../../../Component");
/**
 * Definiuje walidator dla pojedyńczego parametru
 */
class Validator extends Component {

	constructor(name:string){
		super(name);
	}

	public validate(value:any, data:Object):boolean{
		return true;
	}
}
export  = Validator;
