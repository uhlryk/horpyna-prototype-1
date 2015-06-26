import Core = require('./../../../../lib/index');
class MyController extends  Core.SimpleController{
    public get(req,res){
        res.send("hello world");
    }
}
export = MyController;