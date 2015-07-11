/// <reference path="../../../typings/tsd.d.ts" />
import BluebirdPromise = require("bluebird");

class Promise<R> extends  BluebirdPromise<R>{

}
export = Promise;