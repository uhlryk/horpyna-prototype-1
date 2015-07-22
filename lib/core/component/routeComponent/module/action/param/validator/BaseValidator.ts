import Component = require("../../../../../Component");
import ValidatorResponse = require("./ValidatorResponse");
import Param = require("./../Param");
/**
 * Definiuje walidator dla pojedyńczego parametru
 */
class BaseValidator extends Component {
	constructor(name:string){
		super(name);
	}

	public validate(value: any, data?: Object): ValidatorResponse {
		var response = <ValidatorResponse>{
			valid:true,
			value : value,
			validator: this.getName()
		};
		if(this.getParent()){
			var parent: Param = <Param>this.getParent();
			response.field = parent.getParam();
		}
		return response;
	}
}
export = BaseValidator;
