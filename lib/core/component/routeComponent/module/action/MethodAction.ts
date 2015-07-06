import Action = require("./Action");
import IActionMethod = require("./IActionMethod");
export class All extends Action{
    constructor(name:string, options?:any){
        super(IActionMethod.ALL, name, options);
    }
}
export class Get extends Action{
    constructor(name:string, options?:any){
        super(IActionMethod.GET, name, options);
    }
}
export class Post extends Action{
    constructor(name:string, options?:any){
        super(IActionMethod.POST, name, options);
    }
}
export class Put extends Action{
    constructor(name:string, options?:any){
        super(IActionMethod.PUT, name, options);
    }
}
export class Delete extends Action{
    constructor(name:string, options?:any){
        super(IActionMethod.DELETE, name, options);
    }
}
