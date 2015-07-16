/// <reference path="../../../typings/tsd.d.ts" />
import debug = require('debug');
/**
 * Moduł do debugowania, w zmiennych środowiskowych należy ustawić
 * DEBUG=bricker:*
 * zamiast gwiazdki można podać bardziej sszczegółowe oczekiwania np component albo event
 * bardziej szczegółowo to nazwa komponentu lub typ eventu.
 * czyli
 * DEBUG:bricker:component:mycomponent
 */
class Debugger{
	private debugger;
	constructor(namespace:string){
		this.debugger = debug("horpyna:"+namespace);
	}
	public debug(args: any[]){
		this.debugger.apply(this,args);
	}
}
export = Debugger;