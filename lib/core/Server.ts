/// <reference path="../../typings/tsd.d.ts" />
import express = require('express');
import bodyParser = require("body-parser");
import http = require("http");
var morgan = require("morgan");
var favicon = require('serve-favicon');

class Server{
	private _app: express.Express;
	private _server: http.Server;
	private _port: number;
	constructor(port :number){
		this._app = express();
		this._port = port;
		// app.use(favicon(__dirname + '/../public/favicon.ico'));
		this._app.use(bodyParser.json());
		this._app.use(bodyParser.urlencoded({ extended: true }));
	}
	public get app(): express.Express{
		return this._app;
	}
	public prepareServer() {
		this._app.set('port', this._port);
		this._server = http.createServer(this._app);
		this._server.on('error', onError);
		this._server.on('listening', onListening);
		this._server.on('close', onClose);
		function onError(error) {
			if (error.syscall !== 'listen') {
				throw error;
			}
			switch (error.code) {
				case 'EACCES':
					console.error(' requires elevated privileges');
					process.exit(1);
					break;
				case 'EADDRINUSE':
					console.error(' is already in use');
					process.exit(1);
					break;
				default:
					throw error;
			}
		}
		function onClose() {
			console.log("Server Stopped");
		}
		function onListening() {
			var addr = this._server.address();
			var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
			console.log('Listening on ' + bind);
		}
	}
	public run(): http.Server {
		this._server.listen(this._app.get("port"));
		return this._server;
	}
}
export = Server;

