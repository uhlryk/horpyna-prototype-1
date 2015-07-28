import Action = require("./routeComponent/module/action/Action");
import Module = require("./routeComponent/module/Module");
import Component = require("./Component");
import Util = require("../util/Util");
import View = require("../view/View");
import Dispatcher = require("../dispatcher/Dispatcher");
import DbManager = require("../dbManager/DbManager");
class ComponentManager extends Component{
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";

	private _dispatcher: Dispatcher;
	private _dbManager: DbManager;
	private moduleList:Module[];
	/**
	 * Ustawiamy moduł który będzie defaultowy dla route i nie będzie dodawał się do path
	 * Możemy więc przez jakiś moduł mieć dostęp do "/"
	 * @deprecated będziemy rezygnować z defaultowych modułów do skrócenia ścieżki. To ma być robione jawnie
	 */
	// private defaultModule : Module;
	/**
	 * Klasa odpowiedzialna za wyświetlanie widoków
	 */
	private viewClass;
	constructor() {
		super("ComponentManager");
		this.moduleList = [];
		this.componentManager = this;
	}
	public addModule(module:Module) : void{
		this.moduleList.push(module);
		module.parent = this;
		// if(isDefault === true){
		// 	this.defaultModule = module;
		// }
	}
	public getModule(name:string){
		return this.moduleList[name];
	}
	/**
	 * lista modułów bezpośrednio podpiętych pod ComponentManager
	 */
	public getModuleList() : Module[]{
		return this.moduleList;
	}
	/**
	 * @deprecated będziemy rezygnować z defaultowych modułów do skrócenia ścieżki. To ma być robione jawnie
	 */
	// public getDefaultModule():Module{
	// 	return this.defaultModule;
	// }
	public set dispatcher(v: Dispatcher){
		this._dispatcher = v;
	}
	public get dispatcher(): Dispatcher{
		return this._dispatcher;
	}
	public set dbManager(v:DbManager){
		this._dbManager = v;
	}
	public get dbManager(): DbManager {
		return this._dbManager;
	}
	/**
	 * odpala proces inicjacji wszystkich komponentów.
	 * Co polega na tym że wywołuje w swoich podrzędnych komponentach init
	 * A one wywołują to w swoich. Proces idzie do samego dołu. Na tym etapie nie jest zbudowana
	 * jeszcze cała struktura aplikacji. Niektóre komponenty mogą się rozbudowywać
	 */
	public init(): Util.Promise<void> {
		if (this._dispatcher === undefined) {
			throw new Error(ComponentManager.DISPATCHER_NONE);
		}
		if (this._dbManager === undefined) {
			throw new Error(ComponentManager.DB_MANAGER_NONE);
		}
		if(!this.viewClass){
			this.viewClass = View.JsonView;
		}
		this.isInit = true;
		return Util.Promise.resolve()
		.then(()=>{
			return this.initModules();
		});

		// for(var name in this.moduleList){
		// 	var module:Module = this.moduleList[name];
		// 	module.logger = this.logger;
		// 	module.setViewClass(this.viewClass);
		// 	module.init();
		// };
	}
	public initModules(): Util.Promise<any> {
		return Util.Promise.map(this.moduleList, (childModule: Module) => {
			childModule.setViewClass(this.viewClass);
			return childModule.init();
		});
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