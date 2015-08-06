/**
 * Interfejs pojedyńćzego inputa jaki jest generowany w FormAction dla formularza
 */
interface IInputForm {
	isBody: boolean;//oznacza że jest to pole wynikające z pól BODY_FIELD, a np submit będzie miał w tym miejscu false
	name:string;
	type:string;
	label:string;
	value:any;
	valid:boolean;
	errorList: string[];
}
export = IInputForm;