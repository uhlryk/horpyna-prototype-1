import Component = require("../../../../Component");
import FormInputType = require("./../../form/FormInputType");
import BaseValidator = require("./BaseValidator");
import BaseFilter = require("./BaseFilter");
import FieldType = require("./FieldType");
import Util = require("./../../../../../util/Util");
/**
 * Definiuje pojedyńczy parametr jaki otrzymuje akcja w request.
 * Parametr może być dodany do post body, url param, url query
 */
class BaseField extends Component {

	private _validatorList:BaseValidator[];
	private _filterList:BaseFilter[];
	private _fieldName:string;//nazaw pola
	private _type:string;
	private _options: Object;
	private _optional: boolean;
	private _labelForm: string;
	private _formInputType: string;
	/**
	 * @param name określa nazwę będącą identyfikatorem komponentu | nazwa parametru otrzymanego z requesta
	 * @param fieldType url, query, body app
	 */
	constructor(name:string, fieldType:string, options?:Object){
		super(name);
		this._options = options || {};
		this._type = fieldType;
		this._validatorList = [];
		this._filterList = [];
		this._optional = this._options['optional'] || false;
		this._fieldName = this._options['fieldName'] || name;
		this.labelForm = name;
		this.formInputType = FormInputType.TEXT;
		if (fieldType === FieldType.FILE_FIELD){
			this.formInputType = FormInputType.FILE;
		}
	}
	public set optional(val:boolean){
		this._optional = val;
	}
	public get optional():boolean{
		return this._optional;
	}
	public get options(): Object {
		return this._options;
	}
	public set labelForm(v : string) {
		this._labelForm = v;
	}
	public get labelForm() : string {
		return this._labelForm;
	}
	/**
	 * Jakiego typu jest pole na formularzu FormInputType typ
	 */
	public set formInputType(v : string) {
		this._formInputType = v;
	}
	/**
	 * Jakiego typu jest pole na formularzu FormInputType typ
	 */
	public get formInputType() : string {
		return this._formInputType;
	}
	public setFieldName(fieldName: string) {
		this._fieldName = fieldName;
	}
	public init(): Util.Promise<void> {
		return super.init()
		.then(()=>{
			return this.initValidators();
		});
	}
	public initValidators(): Util.Promise<any> {
		return Util.Promise.map(this._validatorList, (validator: BaseValidator) => {
			validator.init();
		});
	}
	public addValidator(validator: BaseValidator): Util.Promise<void> {
		this._validatorList.push(validator);
		if (this.isInit === true) {
			throw SyntaxError(Component.ADD_INIT_CANT);
		}
		return validator.prepare(this);
	}
	public getValidatorList(): BaseValidator[] {
		return this._validatorList;
	}

	public initFilters(): Util.Promise<any> {
		return Util.Promise.map(this._filterList, (filter: BaseFilter) => {
			filter.init();
		});
	}
	public addFilter(filter: BaseFilter): Util.Promise<void> {
		this._filterList.push(filter);
		if (this.isInit === true) {
			throw SyntaxError(Component.ADD_INIT_CANT);
		}
		return filter.prepare(this);
	}
	public getFilterList(): BaseFilter[] {
		return this._filterList;
	}

	/**
	 * Po tym identyfikujemy pole. Domyślnie może być takie samo jak name pola
	 */
	public getFieldName(): string {
		return this._fieldName;
	}
	public getType():string{
		return this._type;
	}
	public getValidator(name: string): BaseValidator {
		for(var index in this._validatorList){
			var validator: BaseValidator = this._validatorList[index];
			if(validator.name === name){
				return validator;
			}
		}
	}
}
export = BaseField;