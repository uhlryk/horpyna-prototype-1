import IModule = require("./../module/IModule");
export interface ModuleList{
    [name:string]:IModule;
}
export interface IModuleManager{
    addModule(name:string, moduleInstance:IModule):void;
    getModule(name:string):IModule;
    getList():ModuleList;
}
