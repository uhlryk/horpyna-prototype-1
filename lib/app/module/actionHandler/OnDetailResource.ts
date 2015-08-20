import Core = require("../../../index");
import ResourceModule = require("./../ResourceModule");
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

		//O => Find
		var findNode = new Core.Node.Db.Find(this);
		this.addChildNode(findNode);
		findNode.setModel(this._module.model);
		findNode.addWhere(Core.Action.FieldType.PARAM_FIELD);
		findNode.addWhere(Core.Action.FieldType.APP_FIELD);

		//O => Find => If
		var ifNode = new Core.Node.Gateway.IfExist(this);
		findNode.addChildNode(ifNode);

		//O => Find => If -> Redirect
		var redirectNode = new Core.Node.Response.Redirect(this);
		ifNode.addNegativeChildNode(redirectNode);
		redirectNode.setTargetAction(this._module.listAction);

		//O => Find => If +> FileLinks
		var fileLinksNode = new Core.Node.Modify.FileLinks(this);
		// fileLinksNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		ifNode.addPositiveChildNode(fileLinksNode);
		fileLinksNode.setFileAction(this._module.fileAction);
		fileLinksNode.mapActionParams(Core.Action.FieldType.PARAM_FIELD);

		//O => Find => If +> FileLinks => ActionLink
		var addActionLinksNode = new Core.Node.Modify.ActionLink(this);
		fileLinksNode.addChildNode(addActionLinksNode);
		addActionLinksNode.addAction(this._module.updateAction.formAction);
		addActionLinksNode.addAction(this._module.deleteAction.formAction);

		var actionNavNode = new Core.Node.Modify.ElementToObject(this);
		addActionLinksNode.addChildNode(actionNavNode);
		actionNavNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		actionNavNode.setKey("nav");

		var combineNode = new Core.Node.Modify.CombineObject(this);
		fileLinksNode.addChildNode(combineNode);
		actionNavNode.addChildNode(combineNode);
		combineNode.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE_1);
		combineNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		combineNode.addSecondarySource(Core.Node.NodeMapper.RESPONSE_NODE_2);
		combineNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		combineNode.setCombineMethod(Core.Node.Modify.CombineObject.NTH_WITH_NTH);

		//O => Find => If +> FileLinks => ActionLink => SendData	=> X
		var sendDataNode = new Core.Node.Response.SendData(this);
		// addActionLinksNode.addChildNode(sendDataNode);
		// fileLinksNode.addChildNode(sendDataNode);
		combineNode.addChildNode(sendDataNode);
		sendDataNode.setView("horpyna/jade/detailAction");

		//O => Empty
		var emptyNode = new Core.Node.Modify.Empty(this);
		this.addChildNode(emptyNode);

		//O => Empty => ActionLink
		var addSecondaryActionLinksNode = new Core.Node.Modify.ActionLink(this);
		emptyNode.addChildNode(addSecondaryActionLinksNode);
		addSecondaryActionLinksNode.addAction(this._module.createAction.formAction);
		addSecondaryActionLinksNode.addAction(this._module.listAction);

		//O => Empty => ActionLink => SendData => X
		var navSendDataNode = new Core.Node.Response.SendData(this);
		addSecondaryActionLinksNode.addChildNode(navSendDataNode);
		navSendDataNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		navSendDataNode.setResponseKey("navigation");
	}
}
export = OnDetailResource;