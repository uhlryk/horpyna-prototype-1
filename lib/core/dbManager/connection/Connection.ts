/// <reference path="../../../../typings/tsd.d.ts" />

import Sequelize = require("sequelize");
import Util = require("./../../util/Util");
import Element = require("../../Element");

class Connection extends Element{
	private dbType:string;
	private host:string;
	private port:number;
	private dbName:string;
	private userName:string;
	private userPassword:string;
	private sequelize:Sequelize.Sequelize;
	private connectionName:string;
	constructor(dbType: string, host: string, port: number, dbName: string, userName: string, userPassword: string, connectionName: string) {
		super();
		this.initDebug("connection");
		this.sequelize = new Sequelize(dbName, userName, userPassword, {
			host : host,
			dialect : dbType,
			port : port,
			logging: (...args: any[]) => {
				this.log(args);
			}
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
	public log(...args: any[]) {
		this.debug(args);
		this.logger.info(args[0]);
	}

}
export = Connection;