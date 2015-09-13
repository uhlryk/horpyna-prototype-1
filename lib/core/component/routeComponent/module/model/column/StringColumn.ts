import BaseColumn = require("./BaseColumn");
class StringColumn extends BaseColumn{
	private length:number;
	private binary:boolean;
	constructor(name: string, length?:number, binary?: boolean) {
		super(name);
		this.debug("String constructor length:" +length + " binary:"+binary);
		this.length = length;
		this.binary = binary;
		this.createColumn();
	}
	public setSize(length:number){
		this.length = length;
		this.createColumn();

	}
	public setBinary(binary:boolean){
		this.binary = binary;
		this.createColumn();
	}
	private createColumn(){
		var type;
		if(this.length){
			type = BaseColumn.DataTypes.STRING(this.length);
		} else {
			type = BaseColumn.DataTypes.STRING;
		}
		if(this.binary){
			type = type.BINARY;
		}
		this.setType(type);
	}
}
export = StringColumn;