import Combine = require("./Combine");
import BaseNode = require("./../BaseNode");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import Util = require("./../../../util/Util");
import IProcessObject = require("./../IProcessObject");
/**
 * Pozwala łączyć wiele Kanałów w jedną listę
 * Łączy przez sumowanie, czyli pierwsza wartość z kanału pierwszego z pierwszą
 * druga wartość z kanału pierwszego z drugą
 */
class AdditionCombine extends Combine {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:AdditionCombine");
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
			var length = firstChanel.length > secondChanel.length ? firstChanel.length : secondChanel.length;
			for (var i = 0; i < length; i++) {
				entryMapped = firstChanel[i];
				secondaryMapped = secondChanel[i];
				if (entryMapped && secondaryMapped){
					processResponse.push(this.mergeObjects(entryMapped, secondaryMapped));
				} else if (entryMapped){
					processResponse.push(this.mergeObjects(entryMapped));
				} else if (secondaryMapped) {
					processResponse.push(this.mergeObjects(secondaryMapped));
				}
			}
			this.debug(processResponse);
			resolve(processResponse);
		});
	}
}
export = AdditionCombine;