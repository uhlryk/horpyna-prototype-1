/**
 *  use with js:
 *  var Core = require("artwave");
 *  var myApp = new Core.Artwave();
 *  we add modulues
 *  myApp.addModule(,new CustomModule("customName",options));
 *  myApp.addModule(new Core.Resource("otherName"options));
 */

export import Application = require("./app/Application");
export import Module = require("./app/module/Module");
export import SimpleModule = require("./app/module/SimpleModule");
export import Controller = require("./app/module/controller/Controller");
export import SimpleController = require("./app/module/controller/SimpleController");
export import MethodAction = require("./app/module/action/MethodAction");