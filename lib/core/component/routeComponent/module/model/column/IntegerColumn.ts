import BaseColumn = require("./BaseColumn");
class IntegerColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.setType(BaseColumn.DataTypes.INTEGER);
	}
}
export = IntegerColumn;