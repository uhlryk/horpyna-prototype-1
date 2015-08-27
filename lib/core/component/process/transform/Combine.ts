import BaseNode = require("./../BaseNode");
import ProcessModel = require("./../ProcessModel");
import Util = require("./../../../util/Util");
/**
 * Pozwala łączyć wiele odpowiedzi w jedną, łączy tylko obiekty i  tablice obiektów
 * Zasada łączenia to każdy z każdym lub pierwszy z pierwszym,n-ty z n-tym
 */
class Combine extends BaseNode{
	private _secondaryType: string;
	constructor(processModel: ProcessModel) {
		super(processModel)
		this.initDebug("node:Combine");
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addSecondarySource(type: string, key?: string[]) {
		this.addMapSource("secondary", type, key);
	}
	public setSecondaryMapType(type: string){
		this._secondaryType = type;
	}
	protected getSecondaryMapType():string{
		return this._secondaryType;
	}
	protected mergeObjects(object1: Object, object2?:Object) {
		var responseObject = new Object();
		for (var key in object1) {
			var value = object1[key];
			var k = Number(key);
			if (k >= 0 && isFinite(k)) {
				this.addToResponseObject(responseObject, k, value);
			} else {
				responseObject[key] = value;
			}
		}
		if (object2) {
			for (var key in object2) {
				var value = object2[key];
				var k = Number(key);
				if (k >= 0 && isFinite(k)) {
					this.addToResponseObject(responseObject, k, value);
				} else {
					responseObject[key] = value;
				}
			}
		}
		return responseObject;
	}
	protected addToResponseObject(responseObject, key, value) {
		if (responseObject[key]){
			this.addToResponseObject(responseObject, key+1, value);
		} else {
			responseObject[key] = value;
		}
	}
}
export = Combine;