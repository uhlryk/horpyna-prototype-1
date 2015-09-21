var config = {};
config.production = {};
config.development = {};

config.default = {};
//konfiguracja aplikacji
config.default.app = {};
config.default.app.port = 8885;
//konfiguracja bazy danych - domyślnego połącznia
config.default.db = {};
config.default.db.type = "";
config.default.db.host = "";
config.default.db.port = 1111;
config.default.db.dbName = "";
config.default.db.user = "";
config.default.db.password = "";
//konfiguracja uploadu plików
config.default.upload = {};
config.default.upload.directory = "./upload";//zbiorczy katalog uploadu
config.default.upload.maxSize = 15;//maksymalny rozmiar pojedyńczego pliku
config.default.upload.maxFiles = 25;//maksymalna liczba w jednym polu plików

module.exports = config;