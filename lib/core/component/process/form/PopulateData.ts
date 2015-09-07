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
 * Wypełnia formularz danymi
 */
class PopulateData extends BaseNode {
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:PopulateData");
	}
	public setFormData(type: string, key?: string[]) {
		this.addMapSource("form_data", type, key);
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var processResponse = [];
		var formGenerator = new FormGenerator();
		var formObject = data.getMappedObject("entry_source");
		var formData = data.getMappedObject("form_data");
		this.debug("formObject");
		this.debug(formObject);
		this.debug("formData");
		this.debug(formData);
		if (formData) {
			formGenerator.populateData(<IForm>formObject, formData);
		}
		processResponse.push(formObject);
		this.debug(processResponse);
		return processResponse;
	}
}
export = PopulateData;