import Util = require("./../../util/Util");
	/**
	 * Sprawdza czy mamy obiekt wejściowy - mappedSource - jeśli nie to go tworzymy
	 * Jeśli dane wejsćiowe to tablica to iterujemy i interesują nas elementy które są obiektami
	 * w każdym obiekcie klucze które są zgodne z sourceTypeKeys przenosimy do mappedSource- mogą się nadpisywać
	 * Jeśli dane wejściowe sourceData to obiekt to iterujemy po nim i do  mappedSource dodajemy te zgodne z sourceTypeKeys
	 *
	 * [{k1,k2},{k1,k3}, [v1]] => {0,k1,k2,k3}
	 */
class NodeMapperObject {
	public map(mappedSource, sourceTypeKeys: string[], sourceData: any): Object[] {
		if (!mappedSource) {
			mappedSource = new Object();
		}
		if (Util._.isArray(sourceData)) {//source jest tablicą obiektów
			for (var i = 0; i < sourceData['length']; i++) {
				var streamObj = sourceData[i];
				if (Util._.isPlainObject(streamObj)) {
					for (var key in streamObj) {
						var value = streamObj[key];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
							mappedSource[key] = value;
						}
					}
				} else if (Util._.isArray(streamObj)) {
					var arr = [];
					for (var j = 0; j < streamObj.length; j++) {
						var value = streamObj[j];
						if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(String(j)) !== -1) {
							mappedSource[String(j)] = value;
						}
					}
				}
			}
		} else if (Util._.isPlainObject(sourceData)) {
			for (var key in sourceData) {
				var value = sourceData[key];
				if (sourceTypeKeys.length === 0 || sourceTypeKeys.indexOf(key) !== -1) {
					mappedSource[key] = value;
				}
			}
		}
		return mappedSource;
	}
}
export = NodeMapperObject;