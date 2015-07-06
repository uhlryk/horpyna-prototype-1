/**
 *  use with js:
 *  var Core = require("artwave");
 *  var myApp = new Core.Artwave();
 *  we add modulues
 *  myApp.addModule(,new CustomModule("customName",options));
 *  myApp.addModule(new Core.Resource("otherName"options));
 */

export import Application = require("./core/Application");
export import Module = require("./core/component/routeComponent/module/Module");
export import MethodAction = require("./core/component/routeComponent/module/action/MethodAction");
export import SimpleModule = require("./app/module/SimpleModule");
