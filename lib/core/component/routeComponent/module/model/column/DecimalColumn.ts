import Column = require("./Column");
class DecimalColumn extends Column{
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
			type = Column.DataTypes.DECIMAL(this.total, this.decimal);
		} else if(this.total){
			type = Column.DataTypes.DECIMAL(this.total);
		} else {
			type = Column.DataTypes.DECIMAL;
		}
		this.setType(type);
	}
}
export = DecimalColumn;