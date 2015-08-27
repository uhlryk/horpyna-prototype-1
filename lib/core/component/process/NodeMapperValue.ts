import Util = require("./../../util/Util");
	/**
	 * otrzymujemy pojedyńczą wartość, która może być wyciągnięta z tablicy obiektów, obiektu, tablicy czy wartości
	 */
class NodeMapperValue {
	public map(mappedSource, sourceTypeKeys: string[], sourceData: any): Object[] {
		if (mappedSource === undefined) {
			mappedSource = null;
		}
		if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
			for (var i = 0; i < sourceData['length']; i++) {
				var streamObj = sourceData[i];
				if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(String(i)) !== -1) {
					if (Util._.isNumber(streamObj) || Util._.isString(streamObj) || Util._.isBoolean(streamObj) || Util._.isDate(streamObj)) {
						mappedSource = streamObj;
					}
				}
			}
		} else if (Util._.isPlainObject(sourceData)) {
			for (var key in sourceData) {
				var value = sourceData[key];
				if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
					mappedSource = value;
				}
			}
		} else if (Util._.isNumber(sourceData) || Util._.isString(sourceData) || Util._.isBoolean(sourceData) || Util._.isDate(sourceData)) {
			if (sourceTypeKeys.length === 0) {
				mappedSource = sourceData;
			}
		}
		return mappedSource;
	}
}
export = NodeMapperValue;