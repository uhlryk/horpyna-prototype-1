import BaseColumn = require("./BaseColumn");
class FloatColumn extends BaseColumn{
	private total:number;
	private decimal:number;
	constructor(name: string, total?:number, decimal?: number) {
		super(name);
		this.debug("Float constructor total:"+total + " decimal:"+decimal);
		this.total = total;
		this.decimal = decimal;
		this.createColumn();
	}
	public setSize(total:number, decimal:number){
		this.total = total;
		this.decimal = decimal;
		this.createColumn();
	}
	private createColumn(){
		var type;
		if(this.total && this.decimal){
			type = BaseColumn.DataTypes.FLOAT(this.total, this.decimal);
		} else if(this.total){
			type = BaseColumn.DataTypes.FLOAT(this.total);
		} else {
			type = BaseColumn.DataTypes.FLOAT;
		}
		this.setType(type);
	}
}
export = FloatColumn;