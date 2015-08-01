/// <reference path="../../../typings/tsd.d.ts" />
import express = require("express");
import Util = require("./../util/Util");
import Element = require("../Element");
/**
 * Obsługuje błędy w dispatcher
 */
class DispatcherError extends Element{
	private _errorHandler: express.ErrorRequestHandler;
	constructor() {
		super();
		this.initDebug("dispatcher");
		this._errorHandler = this.errorHandler;
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