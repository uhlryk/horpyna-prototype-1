import Core = require('./../../../../lib/index');
import MyController = require('./MyController');
class MyModule extends Core.Module{
    onInit(){
        super.onInit();
        this.addController(new MyController("user"))
    }
}
export = MyModule;