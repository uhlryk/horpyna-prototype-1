/// <reference path="../../../../../../typings/tsd.d.ts" />
import express = require("express");
import Component = require("../../../Component");
import Util = require("./../../../../util/Util");

/**
 * Specjalny typ akcji, nie dziedziczy po BaseAction, służy do obsługi błędów aplikacji
 * Posiada handler w którym dajemy funkcję określającą zachowanie na błąd.
 */
class ErrorAction extends Component{
	private errorHandler: express.ErrorRequestHandler;
	constructor(name: string) {
		super(name);
		this.debugger = new Util.Debugger("error:" + this.getName());
	}
	public setErrorHandler(errorHandler: express.ErrorRequestHandler) {
		this.errorHandler = errorHandler;
	}
	public getErrorHandler() {
		this.debug("error:getErrorHandler()");
		return this.errorHandler;
	}
}
export = ErrorAction;