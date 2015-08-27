import Util = require("./../../util/Util");
	/**
	 * sprawdza czy mamy tablicę wejściowa - mappedSource jeśli nie to ją tworzymy
	 * Jeśli dane wejściwe -sourceData są tablicą to iterujemy po każdym elemencie
	 * i interesują nas tylko te elementy które są obiektami, pozostałe ignorujemy
	 * do obiektów zalicza się też array a więc tablica obiektów to też tablica tablic
	 * dla każdego elementy tworzymy nowy obiekt z kluczamy tylko takimi jak są w - sourceTypeKeys - chyba że nie ustawione wtedy
	 * bierzemy wszystkie
	 * Jeśli dane wejściowe - sourceData to obiekt to tworzymy również nowy obiekt składający się z kluczy sourceTypeKeys
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