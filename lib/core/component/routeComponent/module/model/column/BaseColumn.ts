/// <reference path="../../../../../../../typings/tsd.d.ts" />
import Component = require("../../../../Component");
import Sequelize = require("sequelize");
class DataTypes{
	static STRING:any = Sequelize.STRING;
	static TEXT:any = Sequelize.TEXT;
	static INTEGER:any = Sequelize.INTEGER;
	static BIGINT:any = Sequelize.BIGINT;
	static FLOAT:any = Sequelize.FLOAT;
	static DECIMAL:any = Sequelize.DECIMAL;
	static DATE:any = Sequelize.DATE;
	static BOOLEAN:any = Sequelize.BOOLEAN;
	static ENUM:any = Sequelize.ENUM;
	static UUID:any = Sequelize.UUID;
}
class Column extends Component{
	public static DataTypes = DataTypes;
	private attributeOptions:Sequelize.AttributeOptions;
	constructor(name:string){
		super(name);
		this.attributeOptions = <Sequelize.AttributeOptions>{};
		this.attributeOptions.field = name;
	}
	public setType(type:string){
		this.attributeOptions.type = type;
	}
	public setAllowNull(allowNull:boolean){
		this.attributeOptions.allowNull = allowNull;
	}
	public setDefaultValue(defaultValue:any){
		this.attributeOptions.defaultValue = defaultValue;
	}
	public setUnique(unique:any){
		this.attributeOptions.unique = unique;
	}
	public setPrimaryKey(primaryKey:boolean){
		this.attributeOptions.primaryKey = primaryKey;
	}
	public setField(field:string){
		this.attributeOptions.field = field;
	}
	public build(){
		return this.attributeOptions;
	}
}
export = Column;