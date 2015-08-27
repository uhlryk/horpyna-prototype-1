import Combine = require("./Combine");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import ProcessModel = require("./../ProcessModel");
import Util = require("./../../../util/Util");
import NodeMapper = require("./../NodeMapper");
import IProcessObject = require("./../IProcessObject");
/**
 * Pozwala łączyć wiele Kanałów w jedną listę
 * Kanał pierwszy to entry,
 * kanał drugi to addSecondarySource
 * Łączy przez mnożenie, czyli pierwsza wartość z każdą z drugiego kanału wartością
 * druga wartość z z każdą z drugiego kanału wartością
 */
class MultiplicationCombine extends Combine {
	constructor(processModel: ProcessModel) {
		super(processModel)
		this.initDebug("node:MultiplicationCombine");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var entryMappedSource = this.getEntryMappedByType(processEntryList, request);
			var secondaryMappedSource = this.getMappedSource("secondary", this.getSecondaryMapType(), processEntryList, request);
			this.debug("entryMappedSource:");
			this.debug(entryMappedSource);
			this.debug("secondaryMappedSource:");
			this.debug(secondaryMappedSource);
			var processResponse = [];
			var entryMapped, secondaryMapped;
			if ((this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY || this.getEntryMapType() === NodeMapper.MAP_VALUE_ARRAY) &&
				(this.getSecondaryMapType() === NodeMapper.MAP_OBJECT_ARRAY || this.getSecondaryMapType() === NodeMapper.MAP_VALUE_ARRAY))
			{
				for (var i = 0; i < entryMappedSource.length; i++) {
					for (var j = 0; j < secondaryMappedSource.length; j++) {
						entryMapped = entryMappedSource[i];
						if (Util._.isPlainObject(entryMapped) === false){
							entryMapped = [entryMapped];
						}
						secondaryMapped = secondaryMappedSource[j];
						if (Util._.isPlainObject(secondaryMapped) === false) {
							secondaryMapped = [secondaryMapped];
						}
						processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
					}
				}
			} else if ((this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY || this.getEntryMapType() === NodeMapper.MAP_VALUE_ARRAY) &&
				(this.getSecondaryMapType() === NodeMapper.MAP_OBJECT || this.getSecondaryMapType() === NodeMapper.MAP_VALUE))
			{
				for (var i = 0; i < entryMappedSource.length; i++) {
					entryMapped = entryMappedSource[i];
					if (Util._.isPlainObject(entryMapped) === false){
						entryMapped = [entryMapped];
					}
					secondaryMapped = secondaryMappedSource;
					if (Util._.isPlainObject(secondaryMapped) === false) {
						secondaryMapped = [secondaryMapped];
					}
					processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
				}
			} else if ((this.getEntryMapType() === NodeMapper.MAP_OBJECT || this.getEntryMapType() === NodeMapper.MAP_VALUE) &&
				(this.getSecondaryMapType() === NodeMapper.MAP_OBJECT_ARRAY || this.getSecondaryMapType() === NodeMapper.MAP_VALUE_ARRAY))
			{
				for (var i = 0; i < secondaryMappedSource.length; i++) {
					entryMapped = entryMappedSource;
					if (Util._.isPlainObject(entryMapped) === false){
						entryMapped = [entryMapped];
					}
					secondaryMapped = secondaryMappedSource[i];
					if (Util._.isPlainObject(secondaryMapped) === false) {
						secondaryMapped = [secondaryMapped];
					}
					processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
				}
			} else if ((this.getEntryMapType() === NodeMapper.MAP_OBJECT || this.getEntryMapType() === NodeMapper.MAP_VALUE) &&
				(this.getSecondaryMapType() === NodeMapper.MAP_OBJECT || this.getSecondaryMapType() === NodeMapper.MAP_VALUE))
			{
				entryMapped = entryMappedSource;
				if (Util._.isPlainObject(entryMapped) === false){
					entryMapped = [entryMapped];
				}
				secondaryMapped = secondaryMappedSource;
				if (Util._.isPlainObject(secondaryMapped) === false) {
					secondaryMapped = [secondaryMapped];
				}
				processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
			}
			this.debug(processResponse);
			resolve(processResponse);
		});
	}
}
export = MultiplicationCombine;