import Action = require("./routeComponent/module/action/Action");
import Module = require("./routeComponent/module/Module");
import Component = require("./Component");
import Util = require("../util/Util");
import CatchPromiseManager = require("../catchPromise/CatchPromiseManager");
import CatchPromise = require("../catchPromise/CatchPromise");
import FinalActionCatchPromise = require("../catchPromise/FinalActionCatchPromise");
import FinalInitCatchPromise = require("../catchPromise/FinalInitCatchPromise");
import Dispatcher = require("../dispatcher/Dispatcher");
import DbManager = require("../dbManager/DbManager");
class ComponentManager extends Component{
	public static DISPATCHER_NONE: string = "Need 'dispatcher'";
	public static DB_MANAGER_NONE: string = "Need 'dbManager'";

	private _dispatcher: Dispatcher;
	private _dbManager: DbManager;
	private _actionCatchPromiseManager: CatchPromiseManager;
	private _initCatchPromiseManager: CatchPromiseManager;
	private _moduleList:Module[];
	constructor() {
		super("ComponentManager");
		this._moduleList = [];
		this.componentManager = this;
		this._actionCatchPromiseManager = new CatchPromiseManager();
		var finalActionCatchPromise = new FinalActionCatchPromise();
		this._actionCatchPromiseManager.addCatch(finalActionCatchPromise);

		this._initCatchPromiseManager = new CatchPromiseManager();
		var finalInitCatchPromise = new FinalInitCatchPromise();
		this._initCatchPromiseManager.addCatch(finalInitCatchPromise);
	}
	public addModule(module: Module): Util.Promise<void> {
		this._moduleList.push(module);
		return module.prepare(this);
	}
	public getModule(name:string){
		return this._moduleList[name];
	}
	/**
	 * lista modułów bezpośrednio podpiętych pod ComponentManager
	 */
	public getModuleList() : Module[]{
		return this._moduleList;
	}
	public get actionCatchPromiseManager(): CatchPromiseManager {
		return this._actionCatchPromiseManager;
	}
	public get initCatchPromiseManager(): CatchPromiseManager {
		return this._initCatchPromiseManager;
	}
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
		this.isInit = true;
		this._actionCatchPromiseManager.init();
		this._initCatchPromiseManager.init();
		var initPromise = Util.Promise.resolve()
		.then(()=>{
			return this.initModules();
		});
		initPromise = this._initCatchPromiseManager.catchToPromise(initPromise);
		return initPromise;
	}
	public initModules(): Util.Promise<any> {
		return Util.Promise.map(this._moduleList, (childModule: Module) => {
			// childModule.setViewClass(this.viewClass);
			return childModule.init();
		});
	}
	/**
	 * Metoda ta odpalana jest przez któryś z modułów zależnych który przesyła w górę event.
	 * W tym miejscu event przestaje być lokalnym i ta metoda w dół publikuje go do wszystkich
	 * zależnych modułów, a te do swoich zależnych. Każdy moduł sprawdza listę subskrybentów czy
	 * pasują do wzorca i jeśli tak odpalają callbacki.
	 */
	protected callSubscribers(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		Util.Promise.map(this._moduleList, (module: Module) => {
			return module.broadcastPublisher(request, response, type, subtype, emiterPath);
		})
		.then(() => {
			done();
		});
	}
}
export = ComponentManager;