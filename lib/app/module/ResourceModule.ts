import OnListResource = require("./actionHandler/OnListResource");
import OnFileResource = require("./actionHandler/OnFileResource");
import OnFormCreateResource = require("./actionHandler/OnFormCreateResource");
import OnFormUpdateResource = require("./actionHandler/OnFormUpdateResource");
import OnFormDeleteResource = require("./actionHandler/OnFormDeleteResource");
import OnDetailResource = require("./actionHandler/OnDetailResource");
import OnCreateResource = require("./actionHandler/OnCreateResource");
import OnUpdateResource = require("./actionHandler/OnUpdateResource");
import OnDeleteResource = require("./actionHandler/OnDeleteResource");
import SimpleModule = require("./SimpleModule");
import Core = require("../../index");

class ResourceModule extends SimpleModule {
	public static RESOURCE_MODEL = "model";
	public onConstructor() {
		super.onConstructor();
		var resourceModel = new Core.Model(ResourceModule.RESOURCE_MODEL);
		this.addModel(resourceModel, true);

		var onList = new OnListResource(this, resourceModel, "horpyna/jade/listAction", this.fileAction);
		this.listAction.setActionHandler(onList.getActionHandler());

		var onFile = new OnFileResource(resourceModel);
		this.fileAction.setActionHandler(onFile.getActionHandler());

		var onFormCreate = new OnFormCreateResource("horpyna/jade/createFormAction");
		this.createAction.setFormActionHandler(onFormCreate.getActionHandler());

		var onFormUpdate = new OnFormUpdateResource(resourceModel, "horpyna/jade/updateFormAction", this.listAction, this.fileAction);
		this.updateAction.setFormActionHandler(onFormUpdate.getActionHandler());

		var onFormDelete = new OnFormDeleteResource(resourceModel, "horpyna/jade/deleteFormAction", this.listAction, this.fileAction);
		this.deleteAction.setFormActionHandler(onFormDelete.getActionHandler());

		var onDetail = new OnDetailResource(this, resourceModel, "horpyna/jade/detailAction", this.listAction, this.fileAction);
		this.detailAction.setActionHandler(onDetail.getActionHandler());

		var onCreate = new OnCreateResource(resourceModel, this.listAction);
		this.createAction.setActionHandler(onCreate.getActionHandler());

		var onUpdate = new OnUpdateResource(resourceModel, this.listAction, this.listAction);
		this.updateAction.setActionHandler(onUpdate.getActionHandler());

		var onDelete = new OnDeleteResource(resourceModel, this.listAction, this.listAction);
		this.deleteAction.setActionHandler(onDelete.getActionHandler());


	}
	/**
 * rozszerza metodę simpleModule o dodawanie kolumn do defaultowego modelu
 */
	public addField(name: string, formInputType: string, validationNameList: Object, options?: Object) {
		options = options || {};
		super.addField(name, formInputType, validationNameList, options);
		var model = this.getDefaultModel();
		//na razie nie rozbudowujemy tego tak że system ma zamapowane typ forma a typy kolumn
		switch (formInputType){
			case Core.Action.FormInputType.FILE:
				if (options['db_file'] === true) {//znaczy że plik ma być zapisywany w bazie danych a nie na dysku
					model.addColumn(new Core.Column.BlobColumn(name));
				} else {
					model.addColumn(new Core.Column.JsonColumn(name));
				}
				break;
			default:
				model.addColumn(new Core.Column.StringColumn(name, options['length'] || 50));
		}
	}
}
export = ResourceModule;