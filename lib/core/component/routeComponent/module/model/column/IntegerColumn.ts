import Column = require("./Column");
class IntegerColumn extends Column{
	constructor(name:string){
		super(name);
		this.setType(Column.DataTypes.INTEGER);
	}
}
export = IntegerColumn;