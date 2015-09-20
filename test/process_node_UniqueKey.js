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
		myApp = new Core.Application();
		app = myApp.appServer;
		var myModule = new Core.Module(myApp.root, "process");
		var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "myAction");
		myProcessModel = new Core.Node.ProcessModel(myAction);
		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(data) {
			return beforeMapping;
		});
		testNode = new Core.Node.Transform.UniqueKey([myNode1]);

		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
			afterMapping = data.getMappedEntry();
			return null;
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien zwrócić [{0:"k1"},{0:"k2"},{0:"k3"},{0:"k2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}]', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("0","k1");
				expect(afterMapping[1]).to.include.property("0","k2");
				expect(afterMapping[2]).to.include.property("0","k3");
				expect(afterMapping[3]).to.include.property("0","k2");
				done();
			});
	});
	it('Powinien zwrócić [{0:"k1"},{0:"k2"}] gdy podamy [{k1:"v1",k2:"v2"}]', function (done) {
		beforeMapping = {k1:"v1",k2:"v2"};
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0","k1");
				expect(afterMapping[1]).to.include.property("0","k2");
				done();
			});
	});
	it('Powinien zwrócić [{0:"k1"},{0:"k2"},{0:"k3"},{0:"k2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}]', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		testNode.setKey("key");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("key","k1");
				expect(afterMapping[1]).to.include.property("key","k2");
				expect(afterMapping[2]).to.include.property("key","k3");
				expect(afterMapping[3]).to.include.property("key","k2");
				done();
			});
	});
});