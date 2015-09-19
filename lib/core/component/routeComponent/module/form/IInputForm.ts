/**
 * Interfejs pojedyńćzego inputa jaki jest generowany w FormAction dla formularza
 */
interface IInputForm {
	name:string;
	type:string;
	label:string;
	value:any;
	// valid:boolean;
	// errorList: string[];
}
export = IInputForm;