import Action = require("./routeComponent/module/action/Action");
import Module = require("./routeComponent/module/Module");
import Component = require("./Component");
import Util = require("../util/Util");
import View = require("../view/View");
class ComponentManager extends Component{
	private moduleList:Module[];
	/**
	 * Ustawiamy moduł który będzie defaultowy dla route i nie będzie dodawał się do path
	 * Możemy więc przez jakiś moduł mieć dostęp do "/"
	 */
	private defaultModule : Module;
	/**
	 * Klasa odpowiedzialna za wyświetlanie widoków
	 */
	private viewClass;
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
	public init(){
		if(!this.viewClass){
			this.viewClass = View.JsonView;
		}
		for(var name in this.moduleList){
			var module:Module = this.moduleList[name];
			module.logger = this.logger;
			module.setViewClass(this.viewClass);
			module.init();
		};
	}
	public setViewClass(viewClass){
		this.viewClass = viewClass;
	}
	/**
	 * Metoda ta odpalana jest przez któryś z modułów zależnych który przesyła w górę event.
	 * W tym miejscu event przestaje być lokalnym i ta metoda w dół publikuje go do wszystkich
	 * zależnych modułów, a te do swoich zależnych. Każdy moduł sprawdza listę subskrybentów czy
	 * pasują do wzorca i jeśli tak odpalają callbacki.
	 */
	protected callSubscribers(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		Util.Promise.map(this.moduleList, (module: Module) => {
			return module.broadcastPublisher(request, response, type, subtype, emiterPath);
		})
		.then(() => {
			done();
		});
	}

}
export = ComponentManager;