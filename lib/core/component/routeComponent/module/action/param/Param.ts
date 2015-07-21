import Component = require("../../../../Component");
import Validator = require("./validator/Validator");
/**
 * Definiuje pojedyńczy parametr jaki otrzymuje akcja w request.
 * Parametr może być dodany do post body, url param, url query
 */
class Param extends Component {
	private validatorList:Validator[];
	private type:string;
	public optional: boolean;
	/**
	 * @param name określa nazwę będącą identyfikatorem komponentu | nazwa parametru otrzymanego z requesta
	 * @param type url, query, body app
	 */
	constructor(name:string, type:string){
		super(name);
		this.type = type;
		this.validatorList = [];
		this.optional = false;
	}
	protected onInit():void{
		super.onInit();
		this.initValidators();
	}
	public initValidators(){
		for(var index in this.validatorList){
			var validator:Validator = this.validatorList[index];
			validator.logger = this.logger;
			validator.init();
		};
	}
	protected addValidator(validator:Validator){
		this.validatorList.push(validator);
		validator.setParent(this);
	}
	public getValidatorList():Validator[]{
		return this.validatorList;
	}
	public getParam():string{
		return this.getName();
	}
	public getType():string{
		return this.type;
	}
	public getValidator(name:string):Validator{
		for(var index in this.validatorList){
			var validator:Validator = this.validatorList[index];
			if(validator.getName() === name){
				return validator;
			}
		}
	}
	public validate(){

	}
}
export  = Param;