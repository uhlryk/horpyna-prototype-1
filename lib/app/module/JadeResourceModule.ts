import Core = require("../../index");

class JadeResourceModule extends  Core.ResourceModule{
	public onConstructor(){
		super.onConstructor();
		this.setViewClass(Core.View.JadeView);
	}
	public onInit() {
		super.onInit();
	}
	public onFormCreateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:()=>void)=>{
			super.onFormCreateAction(request,response,resolve);
		})
		.then(()=>{
			var view:Core.View.JadeView = response.getView();
			view.setTemplate("horpyna/jadeResource/createFormAction");
			done();
		});
	}
	public onFormUpdateAction (request:Core.ActionRequest, response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:()=>void)=>{
			super.onFormUpdateAction(request,response,resolve);
		})
		.then(()=>{
			var view:Core.View.JadeView = response.getView();
			view.setTemplate("horpyna/jadeResource/updateFormAction");
			done();
		});
	}
	public onListAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:() => void) => {
			super.onListAction(request,response, resolve);
		})
		.then(()=>{
			var view:Core.View.JadeView = response.getView();
			view.setTemplate("horpyna/jadeResource/listAction");
			done();
			});
	}
	public onDetailAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:() => void) => {
			super.onDetailAction(request,response, resolve);
		})
			.then(()=>{
				var view:Core.View.JadeView = response.getView();
				view.setTemplate("horpyna/jadeResource/detailAction");
				done();
			});
	}
	public onCreateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:() => void) => {
			super.onCreateAction(request,response, resolve);
		})
			.then(()=>{
				var view:Core.View.JadeView = response.getView();
				view.setTemplate("index");
				done();
			});
	}
	public onUpdateAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:() => void) => {
			super.onUpdateAction(request,response, resolve);
		})
			.then(()=>{
				var view:Core.View.JadeView = response.getView();
				view.setTemplate("index");
				done();
			});
	}
	public onDeleteAction (request:Core.ActionRequest,response:Core.ActionResponse, done){
		new Core.Util.Promise<void>((resolve:() => void) => {
			super.onDeleteAction(request,response, resolve);
		})
			.then(()=>{
				var view:Core.View.JadeView = response.getView();
				view.setTemplate("index");
				done();
			});
	}
}
export = JadeResourceModule;