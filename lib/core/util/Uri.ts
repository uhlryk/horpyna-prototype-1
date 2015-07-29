/**
 * Metody do modyfikacji uri
 */
class Uri{
	/**
	 * Pozwala dodać do query dodatkowy klucz:wartość. Jeśli klucz już istnieje to wartość zostanie zaktualizowana
	 * @param {string} uri        aktualny uri
	 * @param {string} queryKey   klucz
	 * @param {string} queryValue wartość
	 * @return {string}            zwraca uri który ma już dany klucz
	 */
	public static updateQuery(uri:string, queryKey:string, queryValue:string):string{
		var re = new RegExp("([?&])" + queryKey + "=.*?(&|#|$)(.*)", "gi");
		var hash;

		if (re.test(uri)) {
			if (typeof queryValue !== 'undefined' && queryValue !== null)
				return uri.replace(re, '$1' + queryKey + "=" + queryValue + '$2$3');
			else {
				hash = uri.split('#');
				uri = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
				if (typeof hash[1] !== 'undefined' && hash[1] !== null)
					uri += '#' + hash[1];
				return uri;
			}
		}
		else {
			if (typeof queryValue !== 'undefined' && queryValue !== null) {
				var separator = uri.indexOf('?') !== -1 ? '&' : '?';
				hash = uri.split('#');
				uri = hash[0] + separator + queryKey + '=' + queryValue;
				if (typeof hash[1] !== 'undefined' && hash[1] !== null)
					uri += '#' + hash[1];
				return uri;
			}
			else
				return uri;
		}
	}
}
export = Uri;