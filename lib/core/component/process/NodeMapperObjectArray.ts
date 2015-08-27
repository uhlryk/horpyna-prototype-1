import Util = require("./../../util/Util");
	/**
	 * Dane źródłowe mapuje na tablicę.
	 * Uwzględnia obiekty, i tablice, jeśli będą w tablicy elementy proste to zostaną pominięte
	 * Jeśli podamy w filtrze klucz to z każdego elementu tablicy wyciągnie tylko dane o podanym kluczu
	 * elementy będące tablicami klucze mają numeryczne
	 * [{},{},"aa",[]] => [{},{},[]]
	 *
	 */
class NodeMapperObjectArray{
	public map(mappedSource, sourceTypeKeys: string[], sourceData: any): Object[] {
		if (!mappedSource){
			mappedSource = [];
		}
		if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
			for (var i = 0; i < sourceData['length']; i++) {
				var streamObj = sourceData[i];
				if (Util._.isPlainObject(streamObj)) {
					var element = new Object();
					for (var key in streamObj) {
						var value = streamObj[key];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
							element[key] = value;
						}
					}
					mappedSource.push(element);
				} else if (Util._.isArray(streamObj)) {
					var arr = [];
					for (var j = 0; j < streamObj.length; j++) {
						var value = streamObj[j];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(String(j)) !== -1) {
							arr.push(value);
						}
					}
					mappedSource.push(arr);
				}
			}
		} else if (Util._.isPlainObject(sourceData)) {
			var element = new Object();
			for (var key in sourceData) {
				var value = sourceData[key];
				if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
					element[key] = value;
				}
			}
			mappedSource.push(element);
		}
		return mappedSource;
	}
}
export = NodeMapperObjectArray;