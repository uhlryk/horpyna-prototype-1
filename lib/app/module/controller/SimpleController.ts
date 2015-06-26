import Controller = require("./Controller");
import Action = require("./../action/Action");
import IActionMethod = require("./../action/IActionMethod");
class SimpleController extends  Controller{
    public post:any;
    public get:any;
    public put:any;
    public delete:any;
    public onInit(){
        super.onInit();
        var getAction = new Action(IActionMethod.GET);
        getAction.set(this.get);
        this.addAction(getAction);

        var postAction = new Action(IActionMethod.POST);
        postAction.set(this.post);
        this.addAction(postAction);

        var putAction = new Action(IActionMethod.PUT);
        putAction.set(this.put);
        this.addAction(putAction);

        var deleteAction = new Action(IActionMethod.DELETE);
        deleteAction.set(this.delete);
        this.addAction(deleteAction);
    }
}
export = SimpleController;