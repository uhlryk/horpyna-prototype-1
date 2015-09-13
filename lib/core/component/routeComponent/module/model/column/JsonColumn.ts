import BaseColumn = require("./BaseColumn");
class JsonColumn extends BaseColumn{
	constructor(name: string) {
		super(name);
		this.debug("JsonType constructor");
		this.setType(BaseColumn.DataTypes.JSON);
	}
}
export = JsonColumn;