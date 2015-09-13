import Component = require("../../../../Component");
import ValidatorResponse = require("./ValidatorResponse");
import BaseField = require("./BaseField");
/**
 * Pojedyńczy walidator. podpina się jego instancję pod BaseField
 */
class BaseValidator extends Component {
	public static PREUPLOAD_PHASE: string = "preupload";
	public static POSTUPLOAD_PHASE: string = "postupload";
	public VALIDATOR_NAME = "BaseValidator";
	public message = "";
	private _isFileValidator:boolean;
	private _validatorPhase:string;
	private _logic: (value: any, data: Object, response: ValidatorResponse) => boolean;
	constructor(parent: BaseField, name: string, isFileValidator: boolean, validationPhase?: string) {
		super(<Component>parent, name);
		this._isFileValidator = isFileValidator;
		this._validatorPhase = validationPhase ? validationPhase : BaseValidator.POSTUPLOAD_PHASE;
		this._logic = this.setIsValid;
	}
	public isFileValidator():boolean{
		return this._isFileValidator;
	}
	public get validationPhase():string{
		return this._validatorPhase;
	}
	/**
	 * Zwraca wiadomość w błędzie. W tym miejscu będzie w razie potrzeby ją tłumaczył.
	 * Możemy domyślną wiadomość podmienić inną (template)
	 */
	protected getErrorMessage(template?:string):string{
		return template || this.message;
	}
	/**
	 * Sam validator nie posiada informacji o nazwie parametru który waliduje, ale jako komponent ma powiązanie do BaseField
	 * A ten ma informacje o nazwie pola.
	 * Możliwe że lepiej jak instancja walidatora również sama przechowuje wiedzę o nazwie pola
	 */
	public getFieldName():string{
		if(this.parent){
			var parent: BaseField = <BaseField>this.parent;
			return parent.getFieldName();
		}
		return null;
	}
	/**
	 * Metoda odpala się w Validation, służy do walidcji pola, w odpowiedzi zwraca w promise ValidationResponse
	 */
	public validate(value: any, data: Object, done):void {
		var response = <ValidatorResponse>{
			valid : false,
			value : value,
			validator: this.VALIDATOR_NAME,
			field: this.getFieldName()
		};
		response.valid = this._logic(value, data, response);
		done(response);
	}
	public setLogic(v: (value: any, data: Object, response: ValidatorResponse) => boolean) {
		this._logic = v;
	}
	/**
	 * Wydzielony fragment odpowiadający za określenie dla walidacji true|false
	 * Inne walidatory jeśli nie są skomplikowane mogą po tym dziedziczyć
	 * Jeśli walidacja jest negatywna to dodać możemy wiadomość błędu:
	 * response.errorList = [{
	 *   formatter: any; //wiadomość zawierając %s %d itp
	 *   args?: any[];
	 * }]
	 */
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		return true;
	}
}
export = BaseValidator;
