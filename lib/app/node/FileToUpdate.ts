import Core = require("../../index");
/**
 * Uporządkowuje pliki które mamy w danej akcji i tabeli i edytujemy.
 * Sytuacja jest taka że mamy zapisaną część plików, przez formularz część zapisanych możemy chcieć usunąć jeśli pole jest opcjonalne
 * możemy wgrać nowe pliki które usuną stare
 * Na wyjściu otrzymujemy gotowe dane do Update lub użycia
 *
 * Czyli Klasa
 */
class FileToUpdate extends Core.Node.BaseNode {
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:FileToUpdate");
	}
	public setNewData(type: string) {
		this.addMapSource("new_data", type);
	}
	public setNewFileSource(type: string) {
		this.addMapSource("new_file", type);
	}
	public setExistingSource(type: string) {
		this.addMapSource("existing_file", type);
	}
	protected content(data: Core.Node.NodeData): any {
		this.debug("begin");
		var processResponse = {};
		var existingFileObject = data.getMappedObject("existing_file");
		var newFileObject = data.getMappedObject("new_file");
		var newData = data.getMappedObject("new_data");
		var action = data.getActionRequest().action;
		this.debug(newFileObject);
		for (var key in existingFileObject) {
			var existVal = existingFileObject[key];
			var newFileVal = newFileObject[key];
			var newDataVal = newData[key];
			processResponse[key] = newFileVal || existVal || newDataVal;
		}
		var fileFieldList: Core.Field[] = action.getFieldListByType(Core.Action.FieldType.FILE_FIELD);
		for (var i = 0; i < fileFieldList.length; i++) {
			var field = fileFieldList[i];
			var name = field.name;
			var fieldExistingFile = existingFileObject[name];
			var fieldNewFile = newFileObject[name];
			var fieldNewData = newData[name];
			if (!fieldExistingFile && !fieldNewFile){
				delete processResponse[name];
			}
			/**
			 * usuwamy pliki dla danego pola jeśli :
			 * 1) są w bazie i user wybrał opcję usunięcia a plik jest opcjonalny
			 * 2) jest nowy plik na miejsce starego
			 */
			if (fieldExistingFile) {
				if ((field.optional === true && fieldNewData === "1")) {
					for (var i = 0; i < fieldExistingFile.files.length; i++) {
						var file = fieldExistingFile.files[i];
						this.debug("rm file " + file.path);
						Core.Util.FS.unlinkSync(file.path)
					}
					processResponse[name] = null;
				} else if (fieldNewFile && fieldNewFile.files.length > 0){
					for (var i = 0; i < fieldExistingFile.files.length; i++) {
						var file = fieldExistingFile.files[i];
						this.debug("rm file " + file.path);
						Core.Util.FS.unlinkSync(file.path)
					}
				}
			}
		}
		this.debug(processResponse);
		return processResponse;
	}
}
export = FileToUpdate;