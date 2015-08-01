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
	private defaultConnection:Connection;
	private connectionList:Connection[];
	private debugger: Util.Debugger;
	constructor() {
		super();
		this.connectionList=[];
		this.debugger = new Util.Debugger("core");
		this.debug("dbManager:constructor:");
	}
	public debug(...args: any[]) {
		this.debugger.debug(args);
	}
	public addConnection(connection:Connection, isDefault?:boolean):void{
		this.debug("dbManager:addConnection:"+connection.getConnectionName());
		this.connectionList.push(connection);
		if(isDefault === true){
			this.defaultConnection = connection;
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
		this.debug("dbManager:init:");
		for (var index in this.connectionList) {
			var connection: Connection = this.connectionList[index];
		};
	}
	// public sync():Util.Promise<any>{
	// 	this.debug("dbManager:build:");
	// 	return Util.Promise.map(this.connectionList, (connection:Connection)=>{
	// 		this.debug("dbManager:sync connection:" + connection.getConnectionName());
	// 		return connection.getDb().sync({force:true});
	// 	});
	// }
}
export = DbManager;