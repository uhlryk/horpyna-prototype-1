/**
 * Klasa bazowa do wszystkich obiektów które są kompoentami. Nazwa jest obowiązkowa
 * ponieważ jest to wskaźnik na obiekt.
 * Nazwa może zawierać tylko a-zA-Z\-.
 *
 */
class Component{
	//static count : number = 0;
	private name:string;
	constructor(name:string,options?:any){
		//Component.count++;
		this.name = name;
		this.checkName(name);
	}

	/**
	 * Sprawdza nadaną nazwę komponentowi. Możliwe są tylko litery, wielkie i małe.
	 * @param name
	 */
	protected checkName(name:string){
		if (name.search(/[^a-zA-Z\-]+/) !== -1) {
			throw new SyntaxError("Name can contain only a-zA-Z");
		}
	}
	public getName():string{
		return this.name;
	}
}
export = Component;