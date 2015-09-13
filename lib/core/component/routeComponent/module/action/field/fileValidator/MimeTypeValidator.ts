import Util = require("../../../../../../util/Util");
import ValidatorResponse = require("./../ValidatorResponse");
import BaseValidator = require("./../BaseValidator");
import Field = require("./../Field");
import Component = require("./../../../../../Component");
/**
 * sprawdza czy mime danego pliku jest poprawne
 * listę mime przekazujemy w acceptedMimeTypes. Jest to lista w której mamy mime, ale może też dany element listy być też listą
 * Dzięki czemu możemy zrobić presety mime types
 */
class MimeTypeValidator extends BaseValidator {
	public static ALL_IMAGE_MIME = ['image/bmp', 'image/gif', 'image/jpeg', 'image/tiff'];
	public static JPEG_MIME = 'image/jpeg';
	public static PDF_MIME = ['application/pdf', 'application/x-pdf'];
	public static TEXT_MIME = 'text/plain';
	public VALIDATOR_NAME = "MimeTypeValidator";
	public message = "File %s has wrong mime type %s";
	private _mimeTypes: string[];
	constructor(parent: Field.BaseField, name: string, acceptedMimeTypes, validationPhase?:string) {
		super(parent, name, true, validationPhase);
		if (!validationPhase){
			validationPhase = BaseValidator.POSTUPLOAD_PHASE;
		}
		this._mimeTypes = [];
		if (typeof acceptedMimeTypes !== 'string') {
			for (var i = 0; i < acceptedMimeTypes.length; i++) {
				var mimeObject = acceptedMimeTypes[i];
				if (typeof mimeObject !== 'string') {
					for (var j = 0; j < acceptedMimeTypes.length; j++) {
						var subMimeObject = mimeObject[j];
						this._mimeTypes.push(subMimeObject);
					}
				} else {
					this._mimeTypes.push(mimeObject);
				}
			}
		} else {
			this._mimeTypes.push(acceptedMimeTypes);
		}
	}
	protected setIsValid(value: any, data: Object, response: ValidatorResponse): boolean {
		var valueList = [];
		if(Array.isArray(value)=== false){
			valueList = [value]
		} else{
			valueList = value;
		}
		var valid = true;
		for (var i = 0; i < valueList.length; i++){
			var file = valueList[i];
			if (this._mimeTypes.indexOf(file['mimetype']) === -1) {
				response.errorList = [Util.NodeUtil.format(this.getErrorMessage(), file.originalname, file.mimetype)];
				valid = false;
			}
		}
		return valid;
	}
}
export = MimeTypeValidator;
