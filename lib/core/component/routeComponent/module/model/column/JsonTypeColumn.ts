import BaseColumn = require("./BaseColumn");
class JsonTypeColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.setType(BaseColumn.DataTypes.JSONTYPE);
	}
}
export = JsonTypeColumn;