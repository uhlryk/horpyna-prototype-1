import Component = require("../../../../Component");
import Validator = require("./validator/Validator");
/**
 * Definiuje pojedyńczy parametr jaki otrzymuje akcja w request.
 * Parametr może być dodany do post body, url param, url query
 */
class Param extends Component {
	private validatorList:Validator[];
	private param:string;
	/**
	 * @param name określa nazwę będącą identyfikatorem komponentu
	 * @param param nazwa parametru otrzymanego z requesta, jeśli nie zostanie podana to będzie taka jak name
	 */
	constructor(name:string, param?:string){
		super(name);
		this.param = param || name;
		this.validatorList = [];
	}
	public init():void{
		this.onInit();
		this.initValidators();
	}
	protected onInit():void{

	}
	public initValidators(){
		for(var index in this.validatorList){
			var validator:Validator = this.validatorList[index];
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
		return this.param;
	}
	public getValidator(name:string):Validator{
		for(var index in this.validatorList){
			var validator:Validator = this.validatorList[index];
			if(validator.getName() === name){
				return validator;
			}
		}
	}
}
export  = Param;