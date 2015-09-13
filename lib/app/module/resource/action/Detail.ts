import Core = require("../../../../index");
import ProcessModel = require("../processModel/ProcessModel");

class Detail extends Core.Action.BaseAction {
	constructor(parent: Core.App.Module.Resource, name:string) {
		super(parent, Core.Action.BaseAction.GET, name);
	}
	public onConstructor() {
		var idField: Core.Field.BaseField = new Core.Field.BaseField(this, "id", Core.Field.FieldType.PARAM_FIELD);
	}
	public initProcessModel(){
		var detailProcessModel = new ProcessModel.Detail(<Core.App.Module.Resource>this.parent);
		this.setActionHandler(detailProcessModel.getActionHandler());
	}
}
export = Detail;