import IModule = require("./IModule");
class Module /**implements IModule**/{
    private name:string;
    construct(name:string){
        this.name = name;
    }
    public init(name:string):void{

    }
}
export = Module;