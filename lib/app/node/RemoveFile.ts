import Core = require("../../index");
/**
 * przeszukuje źródło w poszukiwaniu danych o pliku, jeśli je znajdzie to usuwa te pliki
 */
class RemoveFile extends Core.Node.Transform.ChangeObjectElement{
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:RemoveFile");
	}
	protected checkIfValueModify(key: string, value: any, objectToModify: Object, data: Core.Node.NodeData): boolean {
		if (value && value.files) {
			return true;
		}
		return false;
	}
	protected modifyValue(key: string, value: any, objectToModify: Object, data: Core.Node.NodeData): any {
		var uriFileAction = "/";
		for (var i = 0; i < value.files.length; i++) {
			var file = value.files[i];
			this.debug("rm file " + file.path);
			Core.Util.FS.unlinkSync(file.path)
		}
		return value;
	}
}
export = RemoveFile;