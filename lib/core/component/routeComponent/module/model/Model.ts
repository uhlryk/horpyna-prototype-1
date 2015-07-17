import Component = require("../../../Component");
import Column = require("./column/Column");
import Orm = require("../../../../util/Orm");
import Connection = require("../../../../dbManager/connection/Connection");
class Model extends Component{
	private columnList:Column.BaseColumn[];
	private connection:Connection;
	private connectionName:string;
	private model : Orm.Model<any,any>;
	/**
	 * Jeśli true to znaczy że połączenie jest dodane.
	 */
	private connectionSet:boolean;
	constructor(name:string){
		super(name);
		this.columnList = [];
		this.connectionSet = false;
	}
	protected onInit(){
		super.onInit();
		this.initColumns();
	}
	public initColumns(){
		for(var index in this.columnList){
			var column:Column.BaseColumn = this.columnList[index];
			column.logger = this.logger;
			column.init();
		};
	}
	public addColumn(column:Column.BaseColumn){
		this.columnList.push(column);
		column.setParent(this);
	}
	public getColumnList():Column.BaseColumn[]{
		return this.columnList;
	}
	public getColumn(name:string):Column.BaseColumn{
		for(var index in this.columnList){
			var column:Column.BaseColumn = this.columnList[index];
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
			var column:Column.BaseColumn = this.columnList[index];
			tableStructure[column.getName()] = column.build();
		}
		this.model = this.connection.getDb().define(tableName, tableStructure);
	}
	public getModel():Orm.Model<any, any>{
		return this.model;
	}
}
export = Model;