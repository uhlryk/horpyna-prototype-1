import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import IProcessObject = require("./../IProcessObject");
import NodeData = require("./../NodeData");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import SourceType = require("./../SourceType");
import FormGenerator = require("./../../routeComponent/module/form/FormGenerator");
import IForm = require("./../../routeComponent/module/form/IForm");
import ValidationResponse = require("./../../routeComponent/module/action/ValidationResponse");

/**
 * Przeszukuje źródło w poszukiwaniu plików i wybiera ten który jest zgodny z podanym column i count
 */
class PopulateValidation extends BaseNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:PopulateValidation");
	}
	public setValidationMessage(type: string, key?: string[]) {
		this.addMapSource("validation_message", type, key);
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var processResponse = [];
		var formGenerator = new FormGenerator();
		var formObject = data.getMappedObject("entry_source");
		var validationMessage = data.getMappedObject("validation_message");
		this.debug("formObject");
		this.debug(formObject);
		this.debug("validationMessage");
		this.debug(validationMessage);
		if (validationMessage){
			formGenerator.populateValidation(<IForm>formObject, <ValidationResponse>validationMessage);
		}
		processResponse.push(formObject);
		this.debug(processResponse);
		return processResponse;
	}
}
export = PopulateValidation;