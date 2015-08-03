import BaseColumn = require("./BaseColumn");
class IntegerColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.debug("Integer constructor");
		this.setType(BaseColumn.DataTypes.INTEGER);
	}
}
export = IntegerColumn;