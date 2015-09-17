import Core = require("../../../../index");
/**
 * Odpowiada za logikę akcji szczegółów
 */
class Create extends Core.Action.BaseAction {
	private _module: Core.App.Module.Resource;
	constructor(parent: Core.App.Module.Resource, name: string) {
		this._module = parent;
		super(parent, Core.Action.BaseAction.POST, name);
	}
	public onConstructor() {
	}
	public configProcessModel() {
		var processModel = new Core.Node.ProcessModel(this);
	}
}
export = Create;