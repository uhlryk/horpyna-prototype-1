import Column = require("./Column");
class BigIntColumn extends Column{
	constructor(name:string, length?:number){
		super(name);
		var type;
		if(length){
			type = Column.DataTypes.BIGINT(length);
		} else {
			type = Column.DataTypes.BIGINT;
		}
		this.setType(type);
	}
}
export = BigIntColumn;