var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.ObjectAddElement", function() {
	var myProcessModel, myNode2, myNode1a, myNode1b, testNode, beforeMapping1a, beforeMapping1b, afterMapping;
	beforeEach(function (done) {
		myApp = new Core.Application();
		app = myApp.appServer;
		var myModule = new Core.Module(myApp.root, "process");
		var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "myAction");
		myProcessModel = new Core.Node.ProcessModel(myAction);
		myNode1a = new Core.Node.BaseNode([myProcessModel]);
		myNode1a.setContent(function(data) {
			return beforeMapping1a;
		});
		myNode1b = new Core.Node.BaseNode([myProcessModel]);
		myNode1b.setContent(function(data) {
			return beforeMapping1b;
		});
		testNode = new Core.Node.Transform.ObjectAddElement([myNode1a,myNode1b]);
		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
			afterMapping = data.getMappedEntry();
			return null;
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien zwrócić [{k1:"v1", t1:"a1"},{k2:"v2", t1:"a1"}] gdy na wejściu podamy [{k1:"v1"},{k2:"v2"}] i ustawimy addKeyValue("t1","a1")', function (done) {
		beforeMapping1a = [{k1:"v1"},{k2:"v2"}];
		testNode.setKeyValue("t1","a1");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				// console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("t1","a1");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("t1","a1");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1", t1:"a2"},{k2:"v2", t1:"a2"}] gdy na wejściu podamy [{k1:"v1"},{k2:"v2"}] i ustawimy addKeyValue("t1","a1") i addKeyValue("t1","a2")', function (done) {
		beforeMapping1a = [{k1:"v1"},{k2:"v2"}];
		testNode.setKeyValue("t1","a1");
		testNode.setKeyValue("t1","a2");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				// console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("t1","a2");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("t1","a2");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1",t1:"a1",t2:"a2"},{k2:"v2",t1:"a1",t2:"a2"}] gdy na wejściu podamy [{k1:"v1"},{k2:"v2"}] i ustawimy addKeyValue("t1","a1") i addKeyValue("t2","a2")', function (done) {
		beforeMapping1a = [{k1:"v1"},{k2:"v2"}];
		testNode.setKeyValue("t1","a1");
		testNode.setKeyValue("t1","a2");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				// console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("t1","a2");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("t1","a2");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1", t1:["a1","a2"]},{k2:"v2", t1:["a1","a2"]}] gdy na wejściu podamy [{k1:"v1"},{k2:"v2"}] i ustawimy jako addKeyValue("t1",["a1","a2"])', function (done) {
		beforeMapping1a = [{k1:"v1"},{k2:"v2"}];
		testNode.setKeyValue("t1",["a1","a2"]);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				// console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("t1");
				expect(afterMapping[0]["t1"]).to.be.length(2);
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("t1");
				expect(afterMapping[1]["t1"]).to.be.length(2);
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1", t2:["a1","a2"]},{k2:"v2", t2:["a1","a2"]}] gdy na wejściu podamy [{k1:"v1"},{k2:"v2"}] i drugie źródło z "t2" i ["a1","a2"]', function (done) {
		beforeMapping1a = [{k1:"v1"},{k2:"v2"}];
		beforeMapping1b = ["a1","a2"];
		testNode.setKeyValueMapValueArray("t2",[{sourceType:Core.Node.SourceType.RESPONSE_NODE_2}]);
		testNode.addEntryMapSource(Core.Node.SourceType.RESPONSE_NODE_1);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				// console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("t2");
				expect(afterMapping[0]["t2"]).to.be.length(2);
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("t2");
				expect(afterMapping[1]["t2"]).to.be.length(2);
				done();
			});
	});
});