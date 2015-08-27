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
 * Łączy przez sumowanie, czyli pierwsza wartość z kanału pierwszego z pierwszą z drugiego
 * druga wartość z kanału pierwszego z drugą z drugiego
 */
class AdditionCombine extends Combine {
	constructor(processModel: ProcessModel) {
		super(processModel)
		this.initDebug("node:AdditionCombine");
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
				var length = entryMappedSource.length > secondaryMappedSource.length ? entryMappedSource.length : secondaryMappedSource.length;
				for (var i = 0; i < length; i++) {
					entryMapped = entryMappedSource[i];
					secondaryMapped = secondaryMappedSource[i];
					if (entryMapped && Util._.isPlainObject(entryMapped) === false) {
						entryMapped = [entryMapped];
					}
					if (secondaryMapped && Util._.isPlainObject(secondaryMapped) === false) {
						secondaryMapped = [secondaryMapped];
					}
					if (entryMapped && secondaryMapped){
						processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
					} else if (entryMapped){
						processResponse.push(this.mergeObjects(entryMapped));
					} else if (secondaryMapped) {
						processResponse.push(this.mergeObjects(secondaryMapped));
					}
				}
			} else if ((this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY || this.getEntryMapType() === NodeMapper.MAP_VALUE_ARRAY) &&
				(this.getSecondaryMapType() === NodeMapper.MAP_OBJECT || this.getSecondaryMapType() === NodeMapper.MAP_VALUE))
			{
				for (var i = 0; i < entryMappedSource.length; i++) {
					entryMapped = entryMappedSource[i];
					if (entryMapped && Util._.isPlainObject(entryMapped) === false) {
						entryMapped = [entryMapped];
					}
					secondaryMapped = secondaryMappedSource;
					if (secondaryMapped && Util._.isPlainObject(secondaryMapped) === false) {
						secondaryMapped = [secondaryMapped];
					}
					if (i === 0) {
						processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
					} else {
						processResponse.push(this.mergeObjects(entryMapped));
					}
				}
			} else if ((this.getEntryMapType() === NodeMapper.MAP_OBJECT || this.getEntryMapType() === NodeMapper.MAP_VALUE) &&
				(this.getSecondaryMapType() === NodeMapper.MAP_OBJECT_ARRAY || this.getSecondaryMapType() === NodeMapper.MAP_VALUE_ARRAY))
			{
				for (var i = 0; i < secondaryMappedSource.length; i++) {
					entryMapped = entryMappedSource;
					if (entryMapped && Util._.isPlainObject(entryMapped) === false) {
						entryMapped = [entryMapped];
					}
					secondaryMapped = secondaryMappedSource[i];
					if (secondaryMapped && Util._.isPlainObject(secondaryMapped) === false) {
						secondaryMapped = [secondaryMapped];
					}
					if (i === 0) {
						processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
					} else {
						processResponse.push(this.mergeObjects(secondaryMapped));
					}
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
export = AdditionCombine;