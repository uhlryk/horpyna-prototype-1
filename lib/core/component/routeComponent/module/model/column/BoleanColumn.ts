import Column = require("./Column");
class BoleanColumn extends Column{
	constructor(name:string){
		super(name);
		this.setType(Column.DataTypes.BOOLEAN);
	}
}
export = BoleanColumn;