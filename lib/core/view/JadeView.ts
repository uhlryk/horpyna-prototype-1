import BaseView = require("./BaseView");
class JadeRender extends BaseView{
	public render(){
		super.render();
		this.getResponse().render(this.param['view'], this.data);
	}
}
export = JadeRender;