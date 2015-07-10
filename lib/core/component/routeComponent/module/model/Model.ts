/// <reference path="../../../../../../typings/tsd.d.ts" />
import Sequelize = require("sequelize");
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
	private connectionName:string;
	private model : Sequelize.Model<any,any>;
	/**
	 * Jeśli true to znaczy że połączenie jest dodane.
	 */
	private connectionSet:boolean;
	constructor(name:string){
		super(name);
		this.columnList = [];
		this.connectionSet = false;
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
	public addColumn(column:Column){
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

	/**
	 * możemy podać jak ma nazywać się połączenie, a system przy dodawaniu
	 * połączeń doda to o tej nazwie, lub możemy sami ręcznie dodać połączenie
	 * W przeciwnym razie system sam doda połączenie domyślne
	 */
	public setConnectionName(connectionName:string){
		this.connectionName = connectionName;
	}
	public getConnectionName():string{
		return this.connectionName;
	}
	public setConnection(connection:Connection){
		this.connection = connection;
		this.connectionName = this.connection.getConnectionName();
		this.connectionSet=true;
	}
	public isConnection():boolean{
		return this.connectionSet;
	}
	public prepare(){
		//tu musi być nazwa zawierająca całą ścieżkę modułów i nazwę modelu
		var tableName = this.getParent().getName() + "_" + this.getName();
		var tableStructure = {};
		for(var index in this.columnList){
			var column:Column = this.columnList[index];
			tableStructure[column.getName()] = column.build();
		}
		this.model = this.connection.getDb().define(tableName, tableStructure);
	}
	public getModel(){
		return this.model;
	}
}
export = Model;