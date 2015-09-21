import Component = require("../../../Component");
import Module = require("./../Module");
import Column = require("./column/Column");
import Orm = require("../../../../util/Orm");
import Util = require("../../../../util/Util");
import Connection = require("../../../../dbManager/connection/Connection");
class Model extends Component{
	private columnList:Column.BaseColumn[];
	private columntNameList: string[];
	private connection:Connection;
	private _model : Orm.Model<any,any>;
	constructor(parent: Module, name:string) {
		this.columnList = [];
		this.columntNameList = [];
		this.columntNameList.push('id');
		super(<Component>parent, name);
	}
	protected onInit(): Util.Promise<void> {
		this.connection = this.componentManager.dbManager.getConnection();
		return super.onInit()
		.then(()=>{
			return this.build();
		})
		.then(()=>{
			return this.sync();
		});
	}
	public addColumn(column: Column.BaseColumn) {
		if (this.isInit() === true) {
			throw SyntaxError(Component.ADD_INIT_CANT);
		}
		this.columnList.push(column);
		this.columntNameList.push(column.getName());
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
			if(column.getName() === name){
				return column;
			}
		}
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
			tableStructure[column.getName()] = column.build();
		}
		this.debug(tableStructure);
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