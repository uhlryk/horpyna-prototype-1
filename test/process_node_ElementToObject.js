var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.ElementToObject", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping;
	beforeEach(function (done) {
		myApp = new Core.Application(require("./config/config"));
		app = myApp.appServer;
		var myModule = new Core.Module(myApp.root, "process");
		var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "myAction");
		myProcessModel = new Core.Node.ProcessModel(myAction);
		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(data) {
			return beforeMapping;
		});
		testNode = new Core.Node.Transform.ElementToObject([myNode1]);
		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
			afterMapping = data.getMappedEntry();
			return null;
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien zwrócić [] gdy podamy "test"', function (done) {
		beforeMapping = "test";
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(0);
				done();
			});
	});
	it('Powinien zwrócić [{test:{k1:"v1"}}] gdy podamy {k1:"v1"} i ustawimy klucz "k1"', function (done) {
		beforeMapping = {k1:"v1"};
		testNode.setKey("test");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("test");
				expect(afterMapping[0]["test"]).to.include.property("k1","v1");
				done();
			});
	});
	it('Powinien zwrócić [{0:["v1","v2"]},{0:["v3","v4"]}] gdy podamy [["v1","v2"],["v3","v4"]]', function (done) {
		beforeMapping = [["v1","v2"],["v3","v4"]];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0");
				expect(afterMapping[0]["0"]).to.be.length(2);
				expect(afterMapping[0]["0"][0]).to.be.equal("v1");
				expect(afterMapping[0]["0"][1]).to.be.equal("v2");
				expect(afterMapping[1]).to.include.property("0");
				expect(afterMapping[1]["0"]).to.be.length(2);
				expect(afterMapping[1]["0"][0]).to.be.equal("v3");
				expect(afterMapping[1]["0"][1]).to.be.equal("v4");
				done();
			});
	});
	it('Powinien zwrócić [{0:{k1:"v2"}},{0:{k2:"v4"}}] gdy podamy [{k1:"v2"},{k2:"v4"}]', function (done) {
		beforeMapping = [{k1:"v2"},{k2:"v4"}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0");
				expect(afterMapping[0]["0"]).to.include.property("k1","v2");
				expect(afterMapping[1]).to.include.property("0");
				expect(afterMapping[1]["0"]).to.include.property("k2","v4");
				done();
			});
	});
});