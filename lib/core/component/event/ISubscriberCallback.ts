import Action = require("../routeComponent/module/action/Action");
/**
 * Wewnętrzna klasa zawierająca typ eventu i robiąca wspólne zachowania
 */
interface ISubscriberCallback {
	(request: Action.Request, response: Action.Response, done): void;
}
export = ISubscriberCallback;