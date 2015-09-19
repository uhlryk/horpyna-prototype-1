import Core = require("../../../../index");
/**
 * Odpowiada za logikę wyświetlania formularza danej akcji
 */
class CreateForm extends Core.Action.BaseAction {
	private _formGenerator : Core.Node.Form.Generate;
	constructor(parent: Core.Module, name:string) {
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
		var processModel = new Core.Node.ProcessModel(this);
		this._formGenerator = new Core.Node.Form.Generate([processModel]);
		var sendForm = new Core.Node.Response.SendData([this._formGenerator]);
	}
	public get formGenerator(): Core.Node.Form.Generate {
		return this._formGenerator;
	}
}
export = CreateForm;