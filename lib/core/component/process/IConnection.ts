import IProcessObject = require("./IProcessObject");
/**
 * Określa stan połączenia miedzy dwoma nodeami
 * Flow idzie i tak po wszystkich node, jeśli dany node ma zamknięte połączenia to nie wykona się jego logika
 * i prześle tylko sygnał dalej
 */
interface IConnection{
	open: boolean;
	parent: IProcessObject;
	child: IProcessObject;
}
export = IConnection;