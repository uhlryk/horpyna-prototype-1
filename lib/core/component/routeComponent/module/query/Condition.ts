/**
 * Warunki jakie mogą się pojawić w WHERE Query. Dodajemy to jako wartość w Where
 */
class Condition{
	public static GT(value:any){
		return {$gt:value};
	}
	public static GTE(value:any){
		return {$gte:value};
	}
	public static LT(value:any){
		return {$lt:value};
	}
	public static LTE(value:any){
		return {$lte:value};
	}
	public static NE(value:any){
		return {$ne:value};
	}
	public static BETWEEN(min:any,max:any){
		return {$between:[min,max]};
	}
	public static NOT_BETWEEN(min:any,max:any){
		return {$notBetween:[min,max]};
	}
	public static IN(value:any){
		return {$in:value};
	}
	public static LIKE(value:any){
		return {$like:value};
	}
	public static NOT_LIKE(value:any){
		return {$notLike:value};
	}
	private condition:Object;
	constructor(){
		this.condition = new Object();
	}
	public addOperator(operator:Object){
		this.condition[Object.keys(operator)[0]] = operator[0];
	}
}
export = Condition;