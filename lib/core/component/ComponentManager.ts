import Module = require("./routeComponent/module/Module");
import Component = require("./Component");

class ComponentManager extends Component{
	private list:Module[];
	constructor() {
		super("ComponentManager");
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
export = ComponentManager;