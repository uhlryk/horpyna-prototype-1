import IInputForm = require("./IInputForm");
/**
 * Interfejs całego formularza jaki jest generowany w FormAction dla formularza
 */
interface IForm {
	method: string;
	action: string;
	valid: boolean;
	isMultipart: boolean;
	fields: IInputForm[];
	errorList: string[];
}
export = IForm;