import Util = require("../util/Util");
import Element = require("../Element");
import Connection = require("./connection/Connection");
/**
 * Obsługuje komunikację z bazą danych
 * Docelowo może być wiele połączeń do różnych baz danych.
 * W tej chwili akceptuje tylko jedno które musi być defaultowe
 */
class DbManager extends Element{
	public static DEFAULT_CONNECTION_EMPTY: string = "Default connection must be defined";
	public static NO_CONNECTION_NAME: string = "Connection not found";
	private _defaultConnection:Connection;
	private _connectionList:Connection[];
	constructor() {
		super();
		this._connectionList=[];
		this.initDebug("core");
		this.debug("dbManager:constructor:");
	}
	public addConnection(connection:Connection, isDefault?:boolean):void{
		this.debug("dbManager:addConnection:"+connection.getConnectionName());
		this._connectionList.push(connection);
		if(isDefault === true){
			this._defaultConnection = connection;
		}
	}
	public isDefaultConnection():boolean{
		return this._defaultConnection ? true : false;
	}
	public getConnection(name?:string):Connection{
		if(!name){//zwracamy defaultowe
			if(!this._defaultConnection){
				throw new SyntaxError(DbManager.DEFAULT_CONNECTION_EMPTY);
			}
			return this._defaultConnection;
		} else{
			for(var index in this._connectionList){
				var connection:Connection = this._connectionList[index];
				if(connection.getConnectionName() === name){
					return connection;
				}
			};
			throw new SyntaxError(DbManager.NO_CONNECTION_NAME);
		}
	}
	public getDb(name?:string){
		this.getConnection(name).getDb();
	}
	public init(){
	}
}
export = DbManager;