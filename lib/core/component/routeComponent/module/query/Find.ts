import Model = require("../model/Model");
import WhereQuery = require("./WhereQuery");
import List = require("./List");
import Orm = require("../../../../util/Orm");
class Find extends List{
	constructor(){
		super();
	}
	public run():Orm.Promise{
		return this.getModel().getModel().find({
			where:this.getWhereList()
		});
	}
}
export = Find;
