/// <reference path="../../../../../../../typings/tsd.d.ts" />
import Element = require("../../../../../Element");
import Sequelize = require("sequelize");
import DataTypes = require("./DataTypes");

class Column extends Element{
	public static DataTypes = DataTypes;
	private attributeOptions:Sequelize.AttributeOptions;
	constructor(name:string){
		super();
		this.initDebug("column");
		this.attributeOptions = <Sequelize.AttributeOptions>{};
		this.attributeOptions.field = name;
	}
	public getName():string{
		return this.attributeOptions.field;
	}
	public setType(type:string){
		this.debug("setType " + JSON.stringify(type));
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
		this.debug("build " + JSON.stringify(this.attributeOptions));
		return this.attributeOptions;
	}
}
export = Column;