/**
 * Interfejs obiektu określającego validator lub filtr dodany do pola w ResourceModule
 */
interface IValidationFilterData {
	class:any;
	name: string;
	params: any[];
}
export = IValidationFilterData;