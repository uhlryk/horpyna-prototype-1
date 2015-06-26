/**
 *  use with js:
 *  var Core = require("artwave");
 *  var myApp = new Core.Artwave();
 *  we add modulues
 *  myApp.addModule("customName",new CustomModule(options));
 *  myApp.addModule("otherName", new Core.Resource(options));
 */

export import Application = require("./app/Application");
export import IModule = require("./app/module/IModule");
export import Module = require("./app/module/Module");
export import SimpleModule = require("./app/module/SimpleModule");
export import Controller = require("./app/module/controller/Controller");
export import SimpleController = require("./app/module/controller/SimpleController");
