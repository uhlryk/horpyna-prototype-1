/// <reference path="../../../../typings/tsd.d.ts" />

import Sequelize = require("sequelize");
import Util = require("./../../util/Util");

class Connection {
	private dbType:string;
	private host:string;
	private port:number;
	private dbName:string;
	private userName:string;
	private userPassword:string;
	private sequelize:Sequelize.Sequelize;
	private connectionName:string;
	private debugger: Util.Debugger;
	private _logger: Util.Logger;
	constructor(dbType: string, host: string, port: number, dbName: string, userName: string, userPassword: string, connectionName: string) {
		this.debugger = new Util.Debugger("connection:");
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
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	public getDb():Sequelize.Sequelize{
		return this.sequelize;
	}
	public getConnectionName():string{
		return this.connectionName;
	}
	public log(...args: any[]) {
		this.debugger.debug(args);
		this._logger.info(args[0]);
	}

}
export = Connection;