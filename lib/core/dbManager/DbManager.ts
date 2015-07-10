/// <reference path="../../../typings/tsd.d.ts" />
import Promise = require("bluebird");
import Connection = require("./connection/Connection");
/**
 * Obsługuje komunikację z bazą danych
 * Docelowo może być wiele połączeń do różnych baz danych.
 * W tej chwili akceptuje tylko jedno które musi być defaultowe
 */
class DbManager {
	public static DEFAULT_CONNECTION_EMPTY: string = "Default connection must be defined";
	public static NO_CONNECTION_NAME: string = "Connection not found";
	private defaultConnection:Connection;
	private connectionList:Connection[];
	constructor() {
		this.connectionList=[];
	}
	public addConnection(connection:Connection, isDefault?:boolean):void{
		this.connectionList.push(connection);
		if(isDefault === true){
			this.defaultConnection = connection;
		}else{
			throw new Error(DbManager.NOT_IMPLEMENTED);
		}
	}
	public getConnection(name?:string):Connection{
		if(!name){//zwracamy defaultowe
			if(!this.defaultConnection){
				throw new SyntaxError(DbManager.DEFAULT_CONNECTION_EMPTY);
			}
			return this.defaultConnection;
		} else{
			for(var index in this.connectionList){
				var connection:Connection = this.connectionList[index];
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

	/**
	 * Tu jeszcze nie wiem co ma być robione
	 */
	public init(){

	}
	public build():Promise<any>{
		return Promise.map(this.connectionList, function (connection:Connection) {
			return connection.getDb().sync({force:true});
		});
	}
}
export = DbManager;