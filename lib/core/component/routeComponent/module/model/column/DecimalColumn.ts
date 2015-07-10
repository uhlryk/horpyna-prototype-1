import BaseColumn = require("./BaseColumn");
class DecimalColumn extends BaseColumn{
	private total:number;
	private decimal:number;
	constructor(name:string, total?:number, decimal?:number){
		super(name);
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
			type = BaseColumn.DataTypes.DECIMAL(this.total, this.decimal);
		} else if(this.total){
			type = BaseColumn.DataTypes.DECIMAL(this.total);
		} else {
			type = BaseColumn.DataTypes.DECIMAL;
		}
		this.setType(type);
	}
}
export = DecimalColumn;