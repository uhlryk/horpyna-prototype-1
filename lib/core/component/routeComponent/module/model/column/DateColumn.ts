import BaseColumn = require("./BaseColumn");
class DateColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.setType(BaseColumn.DataTypes.DATE);
	}
}
export = DateColumn;