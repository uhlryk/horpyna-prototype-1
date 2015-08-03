import BaseColumn = require("./BaseColumn");
class BooleanColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.debug("Boolean constructor");
		this.setType(BaseColumn.DataTypes.BOOLEAN);
	}
}
export = BooleanColumn;