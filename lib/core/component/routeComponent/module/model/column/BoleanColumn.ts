import BaseColumn = require("./BaseColumn");
class BoleanColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.setType(BaseColumn.DataTypes.BOOLEAN);
	}
}
export = BoleanColumn;