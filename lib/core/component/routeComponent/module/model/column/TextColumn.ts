import BaseColumn = require("./BaseColumn");
class TextColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.setType(BaseColumn.DataTypes.TEXT);
	}
}
export = TextColumn;