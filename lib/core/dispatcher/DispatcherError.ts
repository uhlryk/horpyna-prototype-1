/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Util = require("./../util/Util");

/**
 * Obsługuje błędy w dispatcher
 */
class DispatcherError {
	private _errorHandler: express.ErrorRequestHandler;
	private debugger: Util.Debugger;
	private _logger: Util.Logger;
	constructor() {
		this.debugger = new Util.Debugger("dispatcher");
		this._errorHandler = this.errorHandler;
	}
	public set logger(logger: Util.Logger) {
		this._logger = logger;
	}
	public get logger(): Util.Logger {
		return this._logger;
	}
	public debug(...args: any[]) {
		this.debugger.debug(args);
	}
	/**
	 * Można zmienić zachowanie na błąd
	 */
	public setErrorHandler(errorHandler: express.ErrorRequestHandler) {
		this._errorHandler = errorHandler;
	}
	/**
	 * Wywoływane w Dispatcher.errorRoute
	 */
	public getErrorHandler() {
		this.debug("error:getErrorHandler()");
		return this._errorHandler;
	}
	/**
	 * Konkretne obsłużenie błędu. Gdy używany jest setErrorHandler to ta funkcja jest nadpisana
	 */
	protected errorHandler(err:any, req:express.Request, res:express.Response,next:Function){
		if (err.stack) {
			this.logger.error(err.stack);
		}
		res.sendStatus(500);
	}
}
export = DispatcherError;