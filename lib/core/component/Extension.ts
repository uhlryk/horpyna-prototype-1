import Core = require("./../../index");
import Element = require("./../Element");
/**
 * klasa pozwala dodać do dowolnej innej klasy komponentu rozszerzenie.
 * Czyli dziedziczymy po tej klasie lub wywołujemy setOnCOnstructorHandler
 * ustawiamy w konstruktorze rodzica i możemy wtedy użyć publicznych metod danego parenta
 * Można by to zrobić poza Extension ale w ten sposób możemy robić reusable rozszerzenia
 * i lepsza architektura
 */
class Extension extends Element{
	private _parent: Core.Component;
	private _onConstructorHandler : (parent:Core.Component)=>void
	constructor(parent : Core.Component){
		super();
		this._parent = parent;
		this.onConstructor();
		if(this._onConstructorHandler){
			this._onConstructorHandler(this._parent);
		}
	}
	protected getComponent(): Core.Component {
		return this._parent;
	}
	protected onConstructor(){}
	/**
	 * Pozwala skonfigurować logikę poprzez dziedziczenie tej klasy i dodaniu funkcji do tej metody
	 */
	public setOnConstructorHandler(v: (parent: Core.Component) => void) {
		this._onConstructorHandler = v;
	}
}
export = Extension;