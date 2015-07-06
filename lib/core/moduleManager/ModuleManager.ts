import Module = require("./../component/routeComponent/module/Module");

class ModuleManager{
    private list:Module[];
    constructor() {
        this.list = [];
    }
    public addModule(moduleInstance:Module) : void{
        this.list.push(moduleInstance);

    }
    public getModule(name:string){
        return this.list[name];
    }
    public getModuleList() : Module[]{
        return this.list;
    }
    public initModules(){
        for(var name in this.list){
            var module:Module = this.list[name];
            module.init();
        };
    }

}
export = ModuleManager;