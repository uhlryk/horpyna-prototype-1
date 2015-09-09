import Action = require("./Action");
import BaseField = require("./field/BaseField");
import BaseFilter = require("./field/BaseFilter");
import FieldType = require("./field/FieldType");
import Util = require("./../../../../util/Util");
import Element = require("./../../../../Element");
/**
 * Odpowiada za przeprowadzenie procesu walidacji
 */
class Filtration extends Element {
	private action: Action.BaseAction;
	private request: Action.Request;
	constructor(action:Action.BaseAction, request:Action.Request){
		super();
		this.action = action;
		this.request = request;
		this.initDebug("filtration");
	}
	private filterPromise(): Util.Promise<any> {
		this.debug('filterPromise');
		var fieldList: BaseField[] = this.action.getFieldList();
		return Util.Promise.map(fieldList, (field: BaseField) => {
			var value = this.request.getField(field.getType(), field.name);
			var filterList = field.getFilterList();
			/**
			 * sekwencyjnie odpalają się filtry przekazując następnemu wartość poprzedniego.
			 * Pierwszy dostaje wartość startową
			 */
			var promise = new Util.Promise<any>((resolve: (any) => void) => {
				resolve(value);
			});
			for (var i = 0; i < filterList.length; i++){
				(function(index) {
					promise = promise.then((value) => {
						var filter: BaseFilter = filterList[index];
						return new Util.Promise<any>((resolve: (any) => void) => {
							filter.filter(value, resolve);
						});
					});
				})(i);
			}
			return promise.then((value) => {//w odpowiedzi musimy dostać jedną odpowiedź bo mapa zwróci tablicę
				this.request.addField(field.getType(), field.name, value);
			});
		});
	}
	public filter(): Util.Promise<void> {
		return new Util.Promise<void>((resolve: () => void) => {
			this.filterPromise()
			.then(()=>{
				resolve();
			});
		});
	}
}
export = Filtration;