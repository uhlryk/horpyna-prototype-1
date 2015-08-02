/// <reference path="../../../../../../../typings/tsd.d.ts" />
import Sequelize = require("sequelize");

class DataTypes {
	static STRING: any = Sequelize.STRING;
	static TEXT: any = Sequelize.TEXT;
	static INTEGER: any = Sequelize.INTEGER;
	static BIGINT: any = Sequelize.BIGINT;
	static FLOAT: any = Sequelize.FLOAT;
	static DECIMAL: any = Sequelize.DECIMAL;
	static DATE: any = Sequelize.DATE;
	static BOOLEAN: any = Sequelize.BOOLEAN;
	static ENUM: any = Sequelize.ENUM;
	static HSTORE: any = Sequelize.HSTORE;
	static JSONTYPE: any = Sequelize['JSONTYPE'];
	static JSONB: any = Sequelize['JSONB'];
	static UUID: any = Sequelize.UUID;
}
export = DataTypes;