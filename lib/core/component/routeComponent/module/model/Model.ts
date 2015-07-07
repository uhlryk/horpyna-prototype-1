import Component = require("../../../Component");
import Column = require("./column/Column");
class Model extends Component{
	private columnList:Column[];
	constructor(name:string){
		super(name);
		this.columnList = [];
	}
	public init():void{
		this.onInit();
		this.initColumns();
	}
	public initColumns(){
		for(var index in this.columnList){
			var column:Column = this.columnList[index];
			column.init();
		};
	}
	protected onInit(){

	}
	protected addColumn(column:Column){
		this.columnList.push(column);
		column.setParent(this);
	}
	public getColumnList():Column[]{
		return this.columnList;
	}
	public getColumn(name:string):Column{
		for(var index in this.columnList){
			var column:Column = this.columnList[index];
			if(column.getName() === name){
				return column;
			}
		}
	}
}
export = Model;