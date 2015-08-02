import BaseColumn = require("./BaseColumn");
class JsonBColumn extends BaseColumn{
	constructor(name:string){
		super(name);
		this.setType(BaseColumn.DataTypes.JSONB);
	}
}
export = JsonBColumn;