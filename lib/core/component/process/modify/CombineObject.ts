import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
import Util = require("./../../../util/Util");
import NodeMapper = require("./../NodeMapper");
import IProcessObject = require("./../IProcessObject");
/**
 * Pozwala łączyć wiele odpowiedzi w jedną, łączy tylko obiekty i  tablice obiektów
 * Zasada łączenia to każdy z każdym lub pierwszy z pierwszym,n-ty z n-tym
 */
class CombineObject extends BaseNode{
	public static EACH_WITH_EVERYONE: string = "each_with_everyone";
	public static NTH_WITH_NTH: string = "nth_with_nth";
	private _secondaryType: string;
	private _combineMethod: string;
	constructor(processModel: ProcessModel) {
		super(processModel)
		this._secondaryType = NodeMapper.MAP_OBJECT_ARRAY;
		this._combineMethod = CombineObject.EACH_WITH_EVERYONE;
		this.initDebug("node:CombineObject");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var entryMappedSource = this.getEntryMappedByType(processEntryList, request);
			var secondaryMappedSource = this.getMappedSource("secondary", this._secondaryType, processEntryList, request);
			this.debug("entryMappedSource:");
			this.debug(entryMappedSource);
			this.debug("secondaryMappedSource:");
			this.debug(secondaryMappedSource);
			var processResponse = [];
			if (this._combineMethod === CombineObject.EACH_WITH_EVERYONE) {
				if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY && this._secondaryType === NodeMapper.MAP_OBJECT_ARRAY) {
					for (var i = 0; i < entryMappedSource.length; i++) {
						for (var j = 0; j < secondaryMappedSource.length; j++) {
							processResponse.push(this.mergeObjects(entryMappedSource[i], secondaryMappedSource[j]));
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY && this._secondaryType === NodeMapper.MAP_OBJECT) {
					for (var i = 0; i < entryMappedSource.length; i++) {
						processResponse.push(this.mergeObjects(entryMappedSource[i], secondaryMappedSource));
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT && this._secondaryType === NodeMapper.MAP_OBJECT_ARRAY) {
					for (var i = 0; i < secondaryMappedSource.length; i++) {
						processResponse.push(this.mergeObjects(entryMappedSource, secondaryMappedSource[i]));
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT && this._secondaryType === NodeMapper.MAP_OBJECT) {
					processResponse.push(this.mergeObjects(entryMappedSource, secondaryMappedSource));
				}
			} else if (this._combineMethod === CombineObject.NTH_WITH_NTH) {
				if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY && this._secondaryType === NodeMapper.MAP_OBJECT_ARRAY) {
					var length = entryMappedSource.length > secondaryMappedSource.length ? entryMappedSource.length : secondaryMappedSource.length;
					for (var i = 0; i < length; i++) {
						var entryMapped = entryMappedSource[i];
						var secondaryMapped = secondaryMappedSource[i];
						if (entryMapped && secondaryMapped){
							processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
						} else if (entryMapped){
							processResponse.push(entryMapped);
						} else if (secondaryMapped) {
							processResponse.push(secondaryMapped);
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY && this._secondaryType === NodeMapper.MAP_OBJECT) {
					for (var i = 0; i < entryMappedSource.length; i++) {
						if (i === 0) {
							processResponse.push(this.mergeObjects(entryMappedSource[i], secondaryMappedSource));
						} else {
							processResponse.push(entryMappedSource[i]);
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT && this._secondaryType === NodeMapper.MAP_OBJECT_ARRAY) {
					for (var i = 0; i < secondaryMappedSource.length; i++) {
						if (i === 0) {
							processResponse.push(this.mergeObjects(entryMappedSource, secondaryMappedSource[i]));
						} else {
							processResponse.push(secondaryMappedSource[i]);
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT && this._secondaryType === NodeMapper.MAP_OBJECT) {
					processResponse.push(entryMappedSource, secondaryMappedSource);
				}
			}
			this.debug(processResponse);
			resolve(processResponse);

		});
	}
	public setCombineMethod(method:string){
		this._combineMethod = method;
	}
	/**
	 * Mapujemy jaki typ danych odpowiada za warunki listy
	 */
	public addSecondarySource(type: string, key?: string[]) {
		this.addMapSource("secondary", type, key);
	}
	public setSecondaryMapType(type: string){
		this._secondaryType = type;
	}
	protected mergeObjects(object1: Object, object2:Object) {
		var responseObject = new Object();
		for (var key in object1) {
			var value = object1[key];
			responseObject[key] = value;
		}
		for (var key in object2) {
			var value = object2[key];
			responseObject[key] = value;
		}
		return responseObject;
	}
}
export = CombineObject;