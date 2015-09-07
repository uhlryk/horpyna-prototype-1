import BaseNode = require("./../BaseNode");
import Util = require("./../../../util/Util");
import IProcessObject = require("./../IProcessObject");
import NodeData = require("./../NodeData");
import BaseAction = require("./../../routeComponent/module/action/BaseAction");
import SourceType = require("./../SourceType");
import FormGenerator = require("./../../routeComponent/module/form/FormGenerator");
import IForm = require("./../../routeComponent/module/form/IForm");

/**
 * Przeszukuje źródło w poszukiwaniu plików i wybiera ten który jest zgodny z podanym column i count
 */
class Generate extends BaseNode {
	private _actionList: BaseAction[];
	private _action: BaseAction;
	constructor(parentNodeList: BaseNode[]) {
		super(parentNodeList);
		this.addMapSource("action_param", SourceType.PARAM_FIELD);
		this.addMapSource("action_query", SourceType.QUERY_FIELD);
		this.initDebug("node:Generate");
		this._actionList = [];
	}
	public addFormAction(v: BaseAction) {
		this._actionList.push(v);
	}
	public setTargetAction(v: BaseAction) {
		this._action = v;
	}
	protected content(data: NodeData): any {
		this.debug("begin");
		var processResponse = [];
		var formGenerator = new FormGenerator();
		for (var i = 0; i < this._actionList.length; i++){
			var action = this._actionList[i];
			formGenerator.addFieldList(action.getFieldList());
		}
		var form:IForm = formGenerator.createForm();

		var actionParam = data.getMappedObject("action_param");
		var actionQuery = data.getMappedObject("action_query");
		if (this._action) {
			var url: string = this._action.populateRoutePathWithQuery(actionParam, actionQuery);
			formGenerator.setTarget(form, url);
			formGenerator.setMethod(form, this._action.getMethod());
		}
		var sourceAction = data.getActionRequest().action;
		url = sourceAction.populateRoutePathWithQuery(actionParam, actionQuery);
		formGenerator.setSourceHiddenField(form, url);
		processResponse.push(form);
		this.debug(processResponse);
		return processResponse;
	}
}
export = Generate;