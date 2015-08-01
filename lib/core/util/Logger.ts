/// <reference path="../../../typings/tsd.d.ts" />
import winston = require('winston');
import path = require("path");
class Logger{
	private logger;
	public static CONSOLE_ALL: string = "all";
	public static CONSOLE_ERROR: string = "error";
	public static CONSOLE_MUTE: string = "mute";
	constructor(logPath?:string) {
		logPath = logPath || "'./log";
		var mode = Logger.CONSOLE_MUTE;
		if (process && process.env && process.env.HORPYNA_LOG){
			mode = process.env.HORPYNA_LOG;
		}
		this.logger = new (winston.Logger)();//{
		// transports: [
		// 	new (winston.transports.Console)(),
		// 	new (winston.transports.File)({ filename: 'log/info.log' })
		// ],
		//na razie to robi memory leaki, zostanie odkomentowane jak moduł będzie miał naprawioną funkcję
		// exceptionHandlers: [
		// 	new (winston.transports.Console)(),
		// 	new winston.transports.File({ filename: 'log/exceptions.log' })
		// ]
		// });
		this.logger.add(winston.transports.File, {
			name:'log.error',
			level: 'error',
			filename: path.join(logPath, 'error.log'),
			// handleExceptions: true,
			json: true,
			maxsize: 5242880, //5MB
			maxFiles: 5,
			colorize: false
		});
		this.logger.add(winston.transports.File, {
			name:'log.info',
			level: 'info',
			filename: path.join(logPath, 'info.log'),
			// handleExceptions: true,
			json: true,
			maxsize: 5242880, //5MB
			maxFiles: 5,
			colorize: false
		});
		switch (mode) {
			case Logger.CONSOLE_ALL:
				this.logger.add(winston.transports.Console, {
					level: 'debug',
					// handleExceptions: true,
					json: false,
					colorize: true
				});
				break;
			case Logger.CONSOLE_ERROR:
				this.logger.add(winston.transports.Console, {
					level: 'error',
					// handleExceptions: true,
					json: false,
					colorize: true
				});
				break;
			default:
				//nic nie dodajemy
		}
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