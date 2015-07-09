import Column = require("./Column");
class DateColumn extends Column{
	constructor(name:string){
		super(name);
		this.setType(Column.DataTypes.DATE);
	}
}
export = DateColumn;