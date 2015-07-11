import Module = require("./routeComponent/module/Module");
import Component = require("./Component");
import Util = require("../util/Util");
class ComponentManager extends Component{
	private moduleList:Module[];
	/**
	 * Ustawiamy moduł który będzie defaultowy dla route i nie będzie dodawał się do path
	 * Możemy więc przez jakiś moduł mieć dostęp do "/"
	 */
	private defaultModule : Module;
	constructor() {
		super("ComponentManager");
		this.moduleList = [];
	}
	public addModule(module:Module,isDefault?:boolean) : void{
		this.moduleList.push(module);
		module.setParent(this);
		if(isDefault === true){
			this.defaultModule = module;
		}
	}
	public getModule(name:string){
		return this.moduleList[name];
	}
	public getModuleList() : Module[]{
		return this.moduleList;
	}
	public getDefaultModule():Module{
		return this.defaultModule;
	}
	public initModules(){
		for(var name in this.moduleList){
			var module:Module = this.moduleList[name];
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
	protected callSubscribers(type:string, subtype:string, emiterPath:string, isPublic:boolean, data:Object, done):void{
		Util.Promise.map(this.moduleList, (module:Module)=>{
			return module.broadcastPublisher(type, subtype, emiterPath, data);
		})
		.then(()=>{
			done();
		});
	}
}
export = ComponentManager;