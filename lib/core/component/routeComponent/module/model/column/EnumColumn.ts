import BaseColumn = require("./BaseColumn");
class EnumColumn extends BaseColumn{
	private list:Array<string>;
	constructor(name:string, list?:Array<string>){
		super(name);
		this.list =list || [];
		this.createColumn();
	}
	public setList(list:Array<string>){
		this.list =list;
		this.createColumn();
	}
	private createColumn(){
		this.setType(BaseColumn.DataTypes.ENUM.apply(this,this.list));
	}
}
export = EnumColumn;