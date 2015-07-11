import Model = require("../model/Model");
class Create {
	private model:Model;
	constructor(){

	}
	public setModel(model:Model){
		this.model = model;
	}

	/**
	 * Otrzymane dane w formie {name1:value, name2:value} gdzie typ może być dowolny
	 * dodaje do kolumn i buduje rekord
	 * @param params
	 */
	public populate(params:Object){

	}
}
export = Create;