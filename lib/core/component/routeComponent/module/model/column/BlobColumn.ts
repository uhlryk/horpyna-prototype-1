import BaseColumn = require("./BaseColumn");
class BlobColumn extends BaseColumn{
	constructor(name: string, length?: string) {
		super(name);
		this.debug("Blob constructor length:"+length);
		length = length || "long";
		var type = BaseColumn.DataTypes.BLOB(length);
		this.setType(type);
	}
}
export = BlobColumn;