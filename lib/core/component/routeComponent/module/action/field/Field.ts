import Component = require("../../../../Component");
import Validator = require("./validator/Validator");
import FormType = require("./FormType");
import Util = require("./../../../../../util/Util");
/**
 * Definiuje pojedyńczy parametr jaki otrzymuje akcja w request.
 * Parametr może być dodany do post body, url param, url query
 */
class Field extends Component {

	private validatorList:Validator.BaseValidator[];
	private fieldName:string;//nazaw pola
	private type:string;
	public _optional: boolean;
	private _labelForm: string;
	private _formType: FormType;
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
		this.labelForm = name;
		this.formType = FormType.TEXT;
	}
	public set optional(val:boolean){
		this._optional = val;
	}
	public get optional():boolean{
		return this._optional;
	}
	public set labelForm(v : string) {
		this._labelForm = v;
	}
	public get labelForm() : string {
		return this._labelForm;
	}
	/**
	 * Jakiego typu jest pole na formularzu FormType typ
	 */
	public set formType(v : FormType) {
		this._formType = v;
	}
	/**
	 * Jakiego typu jest pole na formularzu FormType typ
	 */
	public get formType() : FormType {
		return this._formType;
	}
	public setFieldName(fieldName: string) {
		this.fieldName = fieldName;
	}
	public init(): Util.Promise<void> {
		return super.init()
		.then(()=>{
			return this.initValidators();
		});
	}
	public initValidators(): Util.Promise<any> {
		return Util.Promise.map(this.validatorList, (validator: Validator.BaseValidator) => {
			validator.init();
		});
	}
	public addValidator(validator: Validator.BaseValidator): Util.Promise<void> {
		this.validatorList.push(validator);
		if (this.isInit === true) {
			throw SyntaxError(Component.ADD_INIT_CANT);
		}
		return validator.prepare(this);
	}
	public getValidatorList(): Validator.BaseValidator[] {
		return this.validatorList;
	}
	/**
	 * Po tym identyfikujemy pole. Domyślnie może być takie samo jak name pola
	 */
	public getFieldName(): string {
		return this.fieldName;
	}
	public getType():string{
		return this.type;
	}
	public getValidator(name: string): Validator.BaseValidator {
		for(var index in this.validatorList){
			var validator: Validator.BaseValidator = this.validatorList[index];
			if(validator.name === name){
				return validator;
			}
		}
	}
}
export = Field;