var config = {};
config.production = {};
config.development = {};

config.default = {};

config.default.app = {};
config.default.app.port = 8885;

config.default.db = {};
config.default.db.type = "postgres";
config.default.db.host = "localhost";
config.default.db.port = 5432;
config.default.db.dbName = "horpyna";
config.default.db.user = "root";
config.default.db.password = "root";

config.default.upload = {};
config.default.upload.directory = "./test/upload";
config.default.upload.maxSize = 15;
config.default.upload.maxFiles = 25;

module.exports = config;