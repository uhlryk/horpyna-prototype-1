import BaseColumn = require("./BaseColumn");
class DateColumn extends BaseColumn{
	constructor(name:string){
		this.debug("Data constructor");
		super(name);
		this.setType(BaseColumn.DataTypes.DATE);
	}
}
export = DateColumn;