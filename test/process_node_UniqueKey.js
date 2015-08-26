var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.UniqueKey", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");

		myModule.addAction(myAction);
		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());

		myNode1 = new Core.Node.BaseNode(myProcessModel);
		myProcessModel.addChildNode(myNode1);
		myNode1.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping);
			});
		});
		testNode = new Core.Node.Transform.UniqueKey(myProcessModel);
		myNode1.addChildNode(testNode);

		myNode2 = new Core.Node.BaseNode(myProcessModel);
		testNode.addChildNode(myNode2);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				afterMapping = myNode2.getEntryMappedByType(processEntryList, request);
				resolve(null);
			});
		});
		myApp.init().then(function () {
			done();
		});
	});

});