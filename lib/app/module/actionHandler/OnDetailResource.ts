import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class OnDetailResource extends Core.Node.ProcessModel {
	private _module: ResourceModule;
	constructor(module: ResourceModule) {
		super();
		this._module = module;
		this.onConstructor();
	}
	protected onConstructor() {
		var isUnvalid = new Core.Node.Request.IsValid([this]);
		isUnvalid.setNegation();
		var errorResponseCode = new Core.Node.Response.SendData([isUnvalid]);
		errorResponseCode.setStatus(422);

		var isValid = new Core.Node.Request.IsValid([this]);
//O => Find
		var findDbData = new Core.Node.Db.Find([isValid]);
		findDbData.setModel(this._module.model);
		findDbData.addWhere(Core.Node.SourceType.PARAM_FIELD);
		findDbData.addWhere(Core.Node.SourceType.APP_FIELD);
// O => Find => If
		var ifDataExist = new Core.Node.Gateway.IfExist([findDbData]);
		var ifDataNotExist = new Core.Node.Gateway.IfExist([findDbData]);
		ifDataNotExist.setNegation();
//O => Find => If -> Redirect
		var redirectAction = new Core.Node.Response.Redirect([ifDataNotExist]);
		redirectAction.setTargetAction(this._module.listAction);
//O => Find => If +> FileLinks => AddActionLinkToEach
		var addActionLinkToListElement = new AddActionLinkToEach([ifDataExist]);
		addActionLinkToListElement.addAction(this._module.updateAction.formAction);
		addActionLinkToListElement.addAction(this._module.deleteAction.formAction);
//O => Find => If +> FileLinks => AddActionLinkToEach => SendData	=> X
		var sendDataNode = new Core.Node.Response.SendData([addActionLinkToListElement]);
		sendDataNode.setView("horpyna/jade/detailAction");
//O => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Transform.ActionLink([isValid]);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);
		addSecondaryActionLinksNode.addAction(this._module.listAction);
//O => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData([addSecondaryActionLinksNode]);
		navSendDataNode.setResponseKey("navigation");
	}
}
export = OnDetailResource;