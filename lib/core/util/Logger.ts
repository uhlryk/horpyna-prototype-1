/// <reference path="../../../typings/tsd.d.ts" />
import winston = require('winston');

class Logger{
	private logger;
	constructor(){
		this.logger = new (winston.Logger)({
			transports: [
				new (winston.transports.Console)(),
				new (winston.transports.File)({ filename: 'log/info.log' })
			]
		});
	}
	public log(level: string, msg: string, meta?: any): winston.LoggerInstance {
		if(meta){
			return this.logger.log(level, msg, meta);
		} else{
			return this.logger.log(level, msg);
		}
	}
	public debug(msg: string, meta?: any): winston.LoggerInstance {
		if(meta){
			return this.logger.debug(msg, meta);
		} else{
			return this.logger.debug(msg);
		}
	}
	public info(msg: string, meta?: any): winston.LoggerInstance {
		if(meta){
			return this.logger.info(msg, meta);
		} else{
			return this.logger.info(msg);
		}
	}
	public warn(msg: string, meta?: any): winston.LoggerInstance {
		if(meta){
			return this.logger.warn(msg, meta);
		} else{
			return this.logger.warn(msg);
		}
	}
	public error(msg: string, meta?: any): winston.LoggerInstance {
		if(meta){
			return this.logger.error(msg, meta);
		} else{
			return this.logger.error(msg);
		}
	}
	/**
	 * podpinamy pod loggera morgan (trzeba to samodzielnie zrobić)
	 * app.use(require('morgan')("combined",{stream: myApp.getLogger().getStream() }));
	 */
	public getStream() {
		return {
			write: (message, encoding)=> {
				this.logger.info(message);
			}
		};
	}
}
export = Logger;