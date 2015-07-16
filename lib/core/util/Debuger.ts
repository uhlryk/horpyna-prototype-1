/// <reference path="../../../typings/tsd.d.ts" />
var debug = require('debug');
/**
 * Moduł do debugowania, w zmiennych środowiskowych należy ustawić
 * DEBUG=bricker:*
 * zamiast gwiazdki można podać bardziej sszczegółowe oczekiwania np component albo event
 * bardziej szczegółowo to nazwa komponentu lub typ eventu.
 * czyli
 * DEBUG:bricker:component:mycomponent
 */
class Debuger{
	private debuger;
	constructor(namespace:string){
		this.debuger = debug("horpyna:"+namespace);
	}
	public debug(args: any[]){
		this.debuger.apply(this,args);
	}
}
export = Debuger;