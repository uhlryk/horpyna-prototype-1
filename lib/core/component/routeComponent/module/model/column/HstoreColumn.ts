import BaseColumn = require("./BaseColumn");
class Hstore extends BaseColumn{
	constructor(name:string){
		super(name);
		this.debug("Hstore constructor");
		this.setType(BaseColumn.DataTypes.HSTORE);
	}
}
export = Hstore;