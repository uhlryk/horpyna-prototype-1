import Action = require("./Action");
import IActionMethod = require("./IActionMethod");
export class All extends Action{
    constructor(){
        super(IActionMethod.ALL);
    }
}
export class Get extends Action{
    constructor(){
        super(IActionMethod.GET);
    }
}
export class Post extends Action{
    constructor(){
        super(IActionMethod.POST);
    }
}
export class Put extends Action{
    constructor(){
        super(IActionMethod.PUT);
    }
}
export class Delete extends Action{
    constructor(){
        super(IActionMethod.DELETE);
    }
}
