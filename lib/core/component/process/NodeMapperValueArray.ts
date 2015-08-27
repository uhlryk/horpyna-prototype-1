import Util = require("./../../util/Util");
	/**
	 * sprawdza czy mamy tablicę wejsiową - mappedSource - jeśli nie to ją tworzymy
	 * Jeśli dane wejściowe są tablicą to sprawdzamy czy to tablica obiektów
	 * jeśli tak to wyciągamy z każdego obiektu wartości których klucze są zgodne z sourceTypeKeys
	 * lub w przypadku nie ustawienia wszystkie wartości i wrzucamy do tablicy wejściowej
	 * Jeśli w tablicy nie ma obiektu tylko number, string boolean lub data to też zapisujemy w tablicy
	 * Jeśli dane wejściowe to obiekt to wyciągamy wartości których klucze są zgodne z sourceTypeKeys
	 * Jeśli dane wejściowe to tylko number, string boolean lub data to też zapisujemy w tablicy
	 */
class NodeMapperValueArray {
	public map(mappedSource, sourceTypeKeys: string[], sourceData: any): Object[] {
		if (!mappedSource) {
			mappedSource = [];
		}
		if (Util._.isArray(sourceData)) {//source jest tablicą
			for (var i = 0; i < sourceData['length']; i++) {
				var streamObj = sourceData[i];
				if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(String(i)) !== -1) {
					if (Util._.isNumber(streamObj) || Util._.isString(streamObj) || Util._.isBoolean(streamObj) || Util._.isDate(streamObj)) {
						mappedSource.push(streamObj);
					}
				}
			}
		} else if (Util._.isPlainObject(sourceData)) {
			for (var key in sourceData) {
				var value = sourceData[key];
				if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
					mappedSource.push(value);
				}
			}
		} else if (Util._.isNumber(sourceData) || Util._.isString(sourceData) || Util._.isBoolean(sourceData) || Util._.isDate(sourceData)) {
			if (sourceTypeKeys.length === 0) {
				mappedSource.push(sourceData);
			}
		}
		return mappedSource;
	}
}
export = NodeMapperValueArray;