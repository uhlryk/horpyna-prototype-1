import BaseColumn = require("./BaseColumn");
class BigIntColumn extends BaseColumn{
	constructor(name:string, length?:number){
		super(name);
		var type;
		if(length){
			type = BaseColumn.DataTypes.BIGINT(length);
		} else {
			type = BaseColumn.DataTypes.BIGINT;
		}
		this.setType(type);
	}
}
export = BigIntColumn;