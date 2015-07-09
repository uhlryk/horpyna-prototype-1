import Column = require("./Column");
class TextColumn extends Column{
	constructor(name:string){
		super(name);
		this.setType(Column.DataTypes.TEXT);
	}
}
export = TextColumn;