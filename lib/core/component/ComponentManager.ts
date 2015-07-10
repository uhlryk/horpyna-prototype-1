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
		moduleInstance.setParent(this);
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

	/**
	 * Metoda ta odpalana jest przez któryś z modułów zależnych który przesyła w górę event.
	 * W tym miejscu event przestaje być lokalnym i ta metoda w dół publikuje go do wszystkich
	 * zależnych modułów, a te do swoich zależnych. Każdy moduł sprawdza listę subskrybentów czy
	 * pasują do wzorca i jeśli tak odpalają callbacki.
	 * @param data dane wysłane od publishera i do niego muszą wrócić - mogą być zmienione
	 * @returns {any}
	 */
	protected onSendPublisher(data:any):any{
		for(var index in this.list){
			var module:Module = this.list[index];
			data = module.broadcastPublisher(data);
		}
		return data;
	}
}
export = ComponentManager;