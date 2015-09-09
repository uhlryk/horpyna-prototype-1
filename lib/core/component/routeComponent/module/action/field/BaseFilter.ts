import Component = require("../../../../Component");
import Field = require("./Field");
/**
 * Pojedyńczy Filtr. podpina się jego instancję pod Field
 */
class BaseFilter extends Component {
	public FILTER_NAME = "BaseFilter";
	private _isFileFilter:boolean;
	private _logic: (value: any) => any;
	constructor(name:string, isFileFilter:boolean){
		super(name);
		this.initDebug("filter:"+this.FILTER_NAME);
		this._isFileFilter = isFileFilter;
		this._logic = this.logic;
	}
	public isFileFilter():boolean{
		return this._isFileFilter;
	}
	/**
	 * Metoda odpala się w Filtration, służy do filtracji pola, w odpowiedzi zwraca w promise przefiltrowany request
	 */
	public filter(value: any,  done):void {
		this.debug("before filter: " + value);
		var response = this._logic(value);

		this.debug("after filter: " + response);
		done(response);
	}
	protected logic(value: any):any {
		return value;
	}
	public setLogic(v: (value: any) => any) {
		this._logic = v;
	}
}
export = BaseFilter;