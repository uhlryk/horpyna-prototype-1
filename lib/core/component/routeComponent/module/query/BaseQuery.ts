import Model = require("../model/Model");
class BaseQuery {
	private model:Model;
	public setModel(model:Model){
		this.model = model;
	}
	public getModel():Model{
		return this.model;
	}
}
export = BaseQuery;