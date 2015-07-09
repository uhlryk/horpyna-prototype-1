import Component = require("../../../Component");
import Column = require("./column/Column");
import StringColumn = require("./column/StringColumn");
import IntegerColumn = require("./column/IntegerColumn");
import BigIntColumn = require("./column/BigIntColumn");
import TextColumn = require("./column/TextColumn");
import FloatColumn = require("./column/FloatColumn");
import DecimalColumn = require("./column/DecimalColumn");
import DateColumn = require("./column/DateColumn");
import BoleanColumn = require("./column/BoleanColumn");
import EnumColumn = require("./column/EnumColumn");
import Connection = require("../../../../dbManager/connection/Connection");
class Model extends Component{
	public static Column = Column;
	public static StringColumn = StringColumn;
	public static IntegerColumn = IntegerColumn;
	public static TextColumn = TextColumn;
	public static BigIntColumn = BigIntColumn;
	public static FloatColumn = FloatColumn;
	public static DecimalColumn = DecimalColumn;
	public static DateColumn = DateColumn;
	public static BoleanColumn = BoleanColumn;
	public static EnumColumn = EnumColumn;
	private columnList:Column[];
	private connection:Connection;
	constructor(name:string){
		super(name);
		this.columnList = [];
	}
	public init():void{
		this.onInit();
		this.initColumns();
	}
	public initColumns(){
		for(var index in this.columnList){
			var column:Column = this.columnList[index];
			column.init();
		};
	}
	protected onInit(){

	}
	protected addColumn(column:Column){
		this.columnList.push(column);
		column.setParent(this);
	}
	public getColumnList():Column[]{
		return this.columnList;
	}
	public getColumn(name:string):Column{
		for(var index in this.columnList){
			var column:Column = this.columnList[index];
			if(column.getName() === name){
				return column;
			}
		}
	}
	public setConnection(connection:Connection){
		this.connection = connection;
	}
	public prepare(){
		//tu musi być nazwa zawierająca całą ścieżkę modułów i nazwę modelu
		var tableName = this.getParent().getName() + "_" + this.getName();
		var tableStructure = {};
		for(var index in this.columnList){
			var column:Column = this.columnList[index];
			tableStructure[column.getName()] = column.build();
		}
		console.log(tableStructure);
		var m = this.connection.getDb().define(tableName, tableStructure);
	}
}
export = Model;