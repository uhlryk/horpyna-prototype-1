import BaseView = require("./BaseView");
class JadeRender extends BaseView{
	private viewTemplate:string;
	public setTemplate(viewTemplate:string){
		this.viewTemplate = viewTemplate;
	}
	public render(){
		this.getResponse().render(this.viewTemplate, this.getContent());
	}
}
export = JadeRender;