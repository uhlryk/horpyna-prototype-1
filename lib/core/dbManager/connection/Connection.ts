/// <reference path="../../../../typings/tsd.d.ts" />

import SequelizeConstructor = require("sequelize");
class Connection {

	public static DB = SequelizeConstructor;
	private dbType:string;
	private host:string;
	private port:number;
	private dbName:string;
	private userName:string;
	private userPassword:string;
	private sequelize:SequelizeConstructor.Sequelize;
	constructor(dbType:string, host:string, port:number, dbName:string, userName:string, userPassword:string) {
		this.sequelize = new SequelizeConstructor(dbName, userName, userPassword, {
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
	}
	public getDb():SequelizeConstructor.Sequelize{
		return this.sequelize;
	}

}
export = Connection;