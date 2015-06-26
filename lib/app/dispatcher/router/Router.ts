/// <reference path="../../../../typings/tsd.d.ts" />
import express = require("express");

class Router{
    private router:express.Router;
    constructor(router:express.Router) {
        if(router == undefined) {
            this.router = express.Router();
        } else {
            this.router = router;
        }

    }
    public all(routePath:string, callback){
        return this.router.all(routePath,callback);
    }
    public get(routePath:string, callback){
        return this.router.get(routePath,callback);
    }
    public post(routePath:string, callback){
        return this.router.post(routePath,callback);
    }
    public put(routePath:string, callback){
        return this.router.put(routePath,callback);
    }
    public delete(routePath:string, callback){
        return this.router.delete(routePath,callback);
    }
    public use(routeFunc){
        return this.router.use(routeFunc);
    }
    public route(routePath:string){
        return this.router.route(routePath);
    }
}
export = Router;