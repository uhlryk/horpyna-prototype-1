import BaseView = require("./BaseView");
class JsonRender extends BaseView{
	public render(){
		this.getResponse().status(this.getStatus()).json(this.getContent());
	}
}
export = JsonRender;