import Combine = require("./Combine");
import BaseNode = require("./../BaseNode");
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
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList)
		this.initDebug("node:MultiplicationCombine");
	}
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve: (response) => void) => {
			this.debug("begin");
			var firstChanel = this.getMappedEntry(processEntryList, request);
			var secondChanel = this.getMappedObjectArray("second_chanel", processEntryList, request);
			this.debug("firstChanel:");
			this.debug(firstChanel);
			this.debug("secondChanel:");
			this.debug(secondChanel);
			var processResponse = [];
			var entryMapped, secondaryMapped;
			for (var i = 0; i < firstChanel.length; i++) {
				for (var j = 0; j < secondChanel.length; j++) {
					entryMapped = firstChanel[i];
					if (Util._.isPlainObject(entryMapped) === false){
						entryMapped = [entryMapped];
					}
					secondaryMapped = secondChanel[j];
					if (Util._.isPlainObject(secondaryMapped) === false) {
						secondaryMapped = [secondaryMapped];
					}
					processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
				}
			}
			this.debug(processResponse);
			resolve(processResponse);
		});
	}
}
export = MultiplicationCombine;