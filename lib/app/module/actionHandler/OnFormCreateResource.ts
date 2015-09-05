import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
import AddActionLinkToEach = require("./../../node/AddActionLinkToEach");
/**
 * Odpowiada za logikę tworzenia danych
 */
class OnFormCreateResource extends Core.Node.ProcessModel {
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

		var formGenerator = new Core.Node.Form.Generate([isValid]);
		formGenerator.addFormAction(this._module.createAction);
		formGenerator.addFormAction(this._module.createFormAction);

		var sendForm = new Core.Node.Response.SendData([formGenerator]);
	}
}
export = OnFormCreateResource;