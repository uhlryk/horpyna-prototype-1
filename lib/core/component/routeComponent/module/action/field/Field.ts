import Component = require("../../../../Component");
import Validator = require("./validator/Validator");
/**
 * Definiuje pojedyńczy parametr jaki otrzymuje akcja w request.
 * Parametr może być dodany do post body, url param, url query
 */
class Field extends Component {
	private validatorList:Validator.BaseValidator[];
	private fieldName:string;//nazaw pola
	private type:string;
	public _optional: boolean;
	/**
	 * @param name określa nazwę będącą identyfikatorem komponentu | nazwa parametru otrzymanego z requesta
	 * @param type url, query, body app
	 */
	constructor(name:string, type:string, fieldName?:string){
		super(name);
		this.type = type;
		this.validatorList = [];
		this._optional = false;
		this.fieldName = fieldName || name;
	}
	public set optional(val:boolean){
		this._optional = val;
	}
	public get optional():boolean{
		return this._optional;
	}
	protected onInit():void{
		super.onInit();
		this.initValidators();
	}
	public setFieldName(fieldName: string) {
		this.fieldName = fieldName;
	}
	public initValidators(){
		for(var index in this.validatorList){
			var validator: Validator.BaseValidator = this.validatorList[index];
			validator.logger = this.logger;
			validator.init();
		};
	}
	protected addValidator(validator: Validator.BaseValidator) {
		this.validatorList.push(validator);
		validator.setParent(this);
	}
	public getValidatorList(): Validator.BaseValidator[] {
		return this.validatorList;
	}
	public getFieldName(): string {
		return this.fieldName;
	}
	public getType():string{
		return this.type;
	}
	public getValidator(name: string): Validator.BaseValidator {
		for(var index in this.validatorList){
			var validator: Validator.BaseValidator = this.validatorList[index];
			if(validator.getName() === name){
				return validator;
			}
		}
	}
}
export = Field;