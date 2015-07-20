import BaseView = require("./BaseView");
class JsonRender extends BaseView{
	public render(){
		this.getResponse().status(this.status).json(this.data);
	}
}
export = JsonRender;