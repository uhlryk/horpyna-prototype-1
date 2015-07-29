import Component = require("../../../Component");
import Column = require("./column/Column");
import Orm = require("../../../../util/Orm");
import Util = require("../../../../util/Util");
import Connection = require("../../../../dbManager/connection/Connection");
class Model extends Component{
	private columnList:Column.BaseColumn[];
	private columntNameList: string[];
	private connection:Connection;
	// private connectionName:string;
	private _model : Orm.Model<any,any>;
	/**
	 * Jeśli true to znaczy że połączenie jest dodane.
	 */
	private connectionSet:boolean;
	constructor(name:string){
		super(name);
		this.columnList = [];
		this.columntNameList = [];
		this.connectionSet = false;
	}
	public init(): Util.Promise<void> {
		return super.init()
		.then(()=>{
			this.setConnection(this.componentManager.dbManager.getConnection());
			return this.initColumns();
		})
		.then(()=>{
			return this.build();
		})
		.then(()=>{
			return this.sync();
		});
	}
	public initColumns(): Util.Promise<any> {
		return Util.Promise.map(this.columnList, (column: Column.BaseColumn) => {
			return column.init();
		});
	}
	public addColumn(column: Column.BaseColumn): Util.Promise<void> {
		this.columnList.push(column);
		this.columntNameList.push(column.name);
		return column.prepare(this);
	}
	public getColumnList():Column.BaseColumn[]{
		return this.columnList;
	}
	public getColumnNameList():string[]{
		return this.columntNameList;
	}
	public getColumn(name:string):Column.BaseColumn{
		for(var index in this.columnList){
			var column:Column.BaseColumn = this.columnList[index];
			if(column.name === name){
				return column;
			}
		}
	}

	/**
	 * możemy podać jak ma nazywać się połączenie, a system przy dodawaniu
	 * połączeń doda to o tej nazwie, lub możemy sami ręcznie dodać połączenie
	 * W przeciwnym razie system sam doda połączenie domyślne
	 */
	// public setConnectionName(connectionName:string){
	// 	this.connectionName = connectionName;
	// }
	// public getConnectionName():string{
	// 	return this.connectionName;
	// }
	public setConnection(connection:Connection){
		if (this.connectionSet === false) {
			this.connection = connection;
			// this.connectionName = this.connection.getConnectionName();
			this.connectionSet = true;
		}
	}
	public isConnection():boolean{
		return this.connectionSet;
	}
	/**
	 * Buduje strukturę/model
	 */
	private build(){
		//tu musi być nazwa zawierająca całą ścieżkę modułów i nazwę modelu
		var tableName = this.getNamePath("_");
		var tableStructure = {};
		for(var index in this.columnList){
			var column:Column.BaseColumn = this.columnList[index];
			tableStructure[column.name] = column.build();
		}
		this._model = this.connection.getDb().define(tableName, tableStructure, {
			timestamps: false,
		});
	}
	private sync(): Util.Promise<any> {
		return Util.Promise.resolve()
		.then(() => {
			return this.model.sync({ force: true });
		});
	}
	public get model():Orm.Model<any, any>{
		return this._model;
	}
}
export = Model;