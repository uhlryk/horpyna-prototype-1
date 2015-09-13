import BaseColumn = require("./BaseColumn");
class TextColumn extends BaseColumn{
	constructor(name: string) {
		super(name);
		this.debug("Text constructor");
		this.setType(BaseColumn.DataTypes.TEXT);
	}
}
export = TextColumn;