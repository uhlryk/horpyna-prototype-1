import Util = require("./../../../util/Util");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import BaseNode = require("./../BaseNode");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import NodeMapper = require("./../NodeMapper");
import ProcessModel = require("./../ProcessModel");
/**
 * zwraca listę kluczy unikalnych; jeśli źródłem była lista obiektów to zwróci listę list unikalnych kluczy
 * jeśli źródłem była lista wartości to weźmie unikaty; jeśli źródłem była wartość to wrzuci ją w listę
 */
class UniqueKeyList extends BaseNode{
	constructor(processModel: ProcessModel) {
		super(processModel);
		this.initDebug("node:UniqueKeyList");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var entryMappedSource = this.getEntryMappedByType(processEntryList, request);
			this.debug(entryMappedSource);
			var responseArray = [];
			if (entryMappedSource) {
				if (this.getEntryMapType() === NodeMapper.MAP_OBJECT_ARRAY) {
					for (var i = 0; i < entryMappedSource.length; i++) {
						var row = entryMappedSource[i];
						var newRow = [];
						for (var key in row) {
							if (newRow.indexOf(key) === -1) {
								newRow.push(key);
							}
						}
						responseArray.push(newRow);
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_OBJECT) {
					for (var key in entryMappedSource) {
						if (responseArray.indexOf(key) === -1) {
							responseArray.push(key);
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_VALUE_ARRAY) {
					for (var i = 0; i < entryMappedSource.length; i++) {
						var val = entryMappedSource[i];
						if (responseArray.indexOf(val) === -1) {
							responseArray.push(val);
						}
					}
				} else if (this.getEntryMapType() === NodeMapper.MAP_VALUE) {
					responseArray.push(entryMappedSource);
				}
			}
			this.debug(responseArray);
			resolve(responseArray);
		});
	}
}
export = UniqueKeyList;