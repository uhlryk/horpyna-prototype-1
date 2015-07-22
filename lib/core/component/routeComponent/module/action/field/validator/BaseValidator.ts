import Component = require("../../../../../Component");
import ValidatorResponse = require("./ValidatorResponse");
import Field = require("./../Field");
/**
 * Definiuje walidator dla pojedyńczego parametru
 */
class BaseValidator extends Component {
	constructor(name:string){
		super(name);
	}

	public validate(value: any, data: Object, done):void {
		var response = <ValidatorResponse>{
			valid:true,
			value : value,
			validator: this.getName()
		};
		/**
		 * Rodzicem pola może być Field, sprawdzamy czy jest rodzic, rzutujemy go na field i pobieramy nazwę pola
		 */
		if(this.getParent()){
			var parent: Field = <Field>this.getParent();
			response.field = parent.getFieldName();
		}
		done(response);
	}
}
export = BaseValidator;
