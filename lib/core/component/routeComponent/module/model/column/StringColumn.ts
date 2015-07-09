import Column = require("./Column");
class StringColumn extends Column{
	private length:number;
	private binary:boolean;
	constructor(name:string, length?:number, binary?:boolean){
		super(name);
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
			type = Column.DataTypes.STRING(this.length);
		} else {
			type = Column.DataTypes.STRING;
		}
		if(this.binary){
			type = type.BINARY;
		}
		this.setType(type);
	}
}
export = StringColumn;