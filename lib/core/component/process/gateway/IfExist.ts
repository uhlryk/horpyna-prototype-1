import BaseGateway = require("./BaseGateway");
import Util = require("./../../../util/Util");
import Query = require("./../../routeComponent/module/query/Query");
import Response = require("./../../routeComponent/module/action/Response");
import Request = require("./../../routeComponent/module/action/Request");
import IProcessObject = require("./../IProcessObject");
import IConnection = require("./../IConnection");
/**
 * Node zwraca obiekt z danym wpisem w bazie danych
 */
class IfExist extends BaseGateway {
	protected content(processEntryList: any[], request: Request, response: Response, processObjectList: IProcessObject[]): Util.Promise<any> {
		return new Util.Promise<any>((resolve:(response)=>void) => {
			var processObject: IProcessObject = processObjectList[this.processId];
			var processEntry;
			for (var i = 0; i < processEntryList.length; i++){
				var pe = processEntryList[i];
				if(pe){
					processEntry = pe;
					break;
				}
			}
			if(processEntry){//mamy jakąś odpowiedź pozytywną, blokujemy połączenia "negative"
				this.blockNegativeNode(processObject);
				resolve(processEntry);
			} else{//brak odpowiedzi blokujemy więc połączenia "positive"
				this.blockPositiveNode(processObject);
				resolve(null);
			}
		});
	}
}
export = IfExist;