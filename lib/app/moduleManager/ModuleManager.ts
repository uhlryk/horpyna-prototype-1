import IModule = require("./../module/IModule");

class ModuleManager{
    private list:IModule[];
    constructor() {
        this.list = [];
    }
    public addModule(moduleInstance:IModule) : void{
        this.list.push(moduleInstance);

    }
    public getModule(name:string){
        return this.list[name];
    }
    public getModuleList() : IModule[]{
        return this.list;
    }
    public initModules(){
        for(var name in this.list){
            var module:IModule = this.list[name];
            module.init();
        };
    }

}
export = ModuleManager;