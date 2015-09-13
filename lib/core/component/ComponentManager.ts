 import Action = require("./routeComponent/module/action/Action");
import Module = require("./routeComponent/module/Module");
import Component = require("./Component");
import Util = require("../util/Util");
import CatchPromiseManager = require("../catchPromise/CatchPromiseManager");
// import CatchPromise = require("../catchPromise/CatchPromise");
// import FinalActionCatchPromise = require("../catchPromise/FinalActionCatchPromise");
// import FinalInitCatchPromise = require("../catchPromise/FinalInitCatchPromise");
import Dispatcher = require("../dispatcher/Dispatcher");
import DbManager = require("../dbManager/DbManager");
class ComponentManager extends Component{
	private _dispatcher: Dispatcher;
	private _dbManager: DbManager;
	private _actionCatchPromiseManager: CatchPromiseManager;
	private _initCatchPromiseManager: CatchPromiseManager;
	private _moduleList:Module[];
	constructor(dispatcher: Dispatcher, dbManager: DbManager) {
		super(this, "ComponentManager");
		this._dispatcher = dispatcher;
		this._dbManager = dbManager;
		this._moduleList = [];
		this.componentManager = this;
		this._actionCatchPromiseManager = new CatchPromiseManager();
		// var finalActionCatchPromise = new FinalActionCatchPromise();
		// this._actionCatchPromiseManager.addCatch(finalActionCatchPromise);

		this._initCatchPromiseManager = new CatchPromiseManager();
		// var finalInitCatchPromise = new FinalInitCatchPromise();
		// this._initCatchPromiseManager.addCatch(finalInitCatchPromise);
	}
	public addChild(child: Component) {
		super.addChild(child);
		if (child instanceof Module) {
			this._moduleList.push(<Module>child);
		}
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
	public get dispatcher(): Dispatcher{
		return this._dispatcher;
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
	protected onInit(): Util.Promise<void> {
		return super.onInit().then(()=>{
			this._actionCatchPromiseManager.init();
			this._initCatchPromiseManager.init();
		});
	}
	/**
	 * Metoda ta odpalana jest przez któryś z modułów zależnych który przesyła w górę event.
	 * W tym miejscu event przestaje być lokalnym i ta metoda w dół publikuje go do wszystkich
	 * zależnych modułów, a te do swoich zależnych. Każdy moduł sprawdza listę subskrybentów czy
	 * pasują do wzorca i jeśli tak odpalają callbacki.
	 */
	protected callSubscribers(request: Action.Request, response: Action.Response, type: string, subtype: string, emiterPath: string, isPublic: boolean, done): void {
		Util.Promise.map(this._moduleList, (childModule: Module) => {
			return childModule.broadcastPublisher(request, response, type, subtype, emiterPath);
		})
		.then(() => {
			done();
		});
	}
}
export = ComponentManager;