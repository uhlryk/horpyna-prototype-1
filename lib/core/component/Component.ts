/**
 * Klasa bazowa do wszystkich obiektów które są kompoentami. Nazwa jest obowiązkowa
 * ponieważ jest to wskaźnik na obiekt.
 * Nazwa może zawierać tylko a-zA-Z\- i 0-9.
 *
 */
class Component{
	public static WRONG_NAME: string = "Name can contain only a-zA-Z0-9-";
	public static MULTIPLE_PARENT: string = "Component can have only one parent Component";
	//static count : number = 0;
	private name:string;
	private parent:Component;
	constructor(name:string,options?:any){
		//Component.count++;
		this.name = name;
		this.checkName(name);
	}

	/**
	 * Metoda wywoływana jest gdy dany komponent jest dodawany do struktury innego komponentu.
	 * Dodaje do komponentu referencje na parent component. Dodatkowo sprawdza czy dany komponent
	 * nie ma już parenta. Dana instancja komponentu może mieć tylko jeden parent.
	 * @param parent
	 */
	public setParent(parent:Component){
		if(this.parent){
			throw SyntaxError(Component.MULTIPLE_PARENT);
		}
		this.parent = parent;
	}
	public getParent():Component{
		return this.parent;
	}
	/**
	 * Sprawdza nadaną nazwę komponentowi. Możliwe są tylko litery, wielkie i małe.
	 * @param name
	 */
	protected checkName(name:string){
		if (name.search(/[^a-zA-Z0-9\-]+/) !== -1) {
			throw new SyntaxError(Component.WRONG_NAME);
		}
	}
	public getName():string{
		return this.name;
	}
}
export = Component;