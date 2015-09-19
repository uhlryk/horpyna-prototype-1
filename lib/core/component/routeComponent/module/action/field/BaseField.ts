import Component = require("../../../../Component");
import BaseAction = require("./../BaseAction");
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
	/**
	 * @param name określa nazwę będącą identyfikatorem komponentu | nazwa parametru otrzymanego z requesta
	 * @param fieldType url, query, body app
	 */
	constructor(parent: BaseAction,name:string, fieldType: string, options?: Object) {
		super(<Component>parent, name);
		this._options = options || {};
		this._type = fieldType;
		this._validatorList = [];
		this._filterList = [];
		this._optional = this._options['optional'] || false;
		this._fieldName = this._options['fieldName'] || name;
		this.labelForm = name;
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
	public setFieldName(fieldName: string) {
		this._fieldName = fieldName;
	}
	public addChild(child: Component) {
		if (this.isInit()) {
			throw SyntaxError(Component.ADD_INIT_CANT);
		}
		super.addChild(child);
		if (child instanceof BaseValidator) {
			this._validatorList.push(<BaseValidator>child);
		} else if (child instanceof BaseFilter) {
			this._filterList.push(<BaseFilter>child);
		}
	}
	public getValidatorList(): BaseValidator[] {
		return this._validatorList;
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