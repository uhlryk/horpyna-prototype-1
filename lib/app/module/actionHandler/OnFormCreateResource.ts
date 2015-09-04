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
		var formGenerator = new Core.Node.Form.Generate([this]);
		formGenerator.addFormAction(this._module.createAction);
		formGenerator.addFormAction(this._module.createFormAction);

		var sendForm = new Core.Node.Response.SendData([formGenerator]);
	}
}
export = OnFormCreateResource;