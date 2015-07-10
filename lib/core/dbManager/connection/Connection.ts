/// <reference path="../../../../typings/tsd.d.ts" />

import Sequelize = require("sequelize");
class Connection {
	private dbType:string;
	private host:string;
	private port:number;
	private dbName:string;
	private userName:string;
	private userPassword:string;
	private sequelize:Sequelize.Sequelize;
	private connectionName:string;
	constructor(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string, connectionName:string) {
		this.sequelize = new Sequelize(dbName, userName, userPassword, {
			host : host,
			dialect : dbType,
			port : port
		});
		this.dbType = dbType;
		this.host = host;
		this.port = port;
		this.dbName = dbName;
		this.userName = userName;
		this.userPassword = userPassword;
		this.connectionName = connectionName;
	}
	public getDb():Sequelize.Sequelize{
		return this.sequelize;
	}
	public getConnectionName():string{
		return this.connectionName;
	}
}
export = Connection;