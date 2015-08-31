import Combine = require("./Combine");
import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import NodeData = require("./../NodeData");
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
	protected content(data: NodeData): any {
		this.debug("begin");
		var firstChanel = data.getMappedEntry();
		var secondChanel = data.getMappedObjectArray("second_chanel");
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
		return processResponse;
	}
}
export = AdditionCombine;