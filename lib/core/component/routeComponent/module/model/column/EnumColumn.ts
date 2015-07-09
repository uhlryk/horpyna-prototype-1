import Column = require("./Column");
class EnumColumn extends Column{
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
		this.setType(Column.DataTypes.ENUM.apply(this,this.list));
	}
}
export = EnumColumn;