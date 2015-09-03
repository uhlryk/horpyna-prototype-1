import Core = require("../../index");
/**
 * Przeszukuje źródło w poszukiwaniu plików i wybiera ten który jest zgodny z podanym column i count
 */
class FileToData extends Core.Node.BaseNode {
	constructor(parentNodeList: Core.Node.BaseNode[]) {
		super(parentNodeList);
		this.initDebug("node:FileToData");
	}
	public setFileSource(type: string) {
		this.addMapSource("file", type);
	}
	public setColumn(type: string, key: string){
		this.setMapSource("column", type, key);
	}
	public setCount(type: string, key: string){
		this.setMapSource("count", type, key);
	}
	protected content(data: Core.Node.NodeData): any {
		this.debug("begin");
		var processResponse = [];
		var columnEntry = data.getMappedValue("column");
		var countEntry = data.getMappedValue("count");
		var fileSource = data.getMappedObjectArray("file");
		this.debug(fileSource);
		for (var j = 0; j < fileSource.length; j++) {
			var dataList = fileSource[j];
			for (var columnName in dataList) {
				if (columnEntry === null || columnName === columnEntry) {
					var column = dataList[columnName];
					if (column && column.files) {
						var file = column.files[countEntry];
						if (file['path'] && file['originalname']) {
							processResponse.push({
								path: file['path'],
								name: file['originalname']
							});
						}
					}
				}
			}
		}
		this.debug(processResponse);
		return processResponse;
	}
}
export = FileToData;