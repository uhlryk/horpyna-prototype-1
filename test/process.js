var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Funkcje ProcessModel Nodes", function() {
	describe("Testowanie mapowania danych z jednego źródła", function () {
		var myNode2, beforeMapping, afterMapping;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("process");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");

			myModule.addAction(myAction);
			var myProcessModel = new Core.Node.ProcessModel();
			myAction.setActionHandler(myProcessModel.getActionHandler());

			var myNode1 = new Core.Node.BaseNode(myProcessModel);
			myProcessModel.addChildNode(myNode1);
			myNode1.setContent(function(processEntryList, request, response, processList) {
				return new Core.Util.Promise(function(resolve){
					resolve(beforeMapping);
				});
			});
			myNode2 = new Core.Node.BaseNode(myProcessModel);
			myNode1.addChildNode(myNode2);
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
		describe("Gdy mamy ustawiony typ mapowania MAP_OBJECT_ARRAY", function () {
			it('Powinien zwrócić [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.include.property("k1","v1");
						expect(afterMapping[0]).to.include.property("k2","v2");
						expect(afterMapping[1]).to.include.property("k3","v1");
						expect(afterMapping[1]).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [{k2:"v2"},{k2:"v2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i entryMapSource ma key ["k2"]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["k2"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.not.include.property("k1");
						expect(afterMapping[0]).to.include.property("k2","v2");
						expect(afterMapping[1]).to.not.include.property("k3");
						expect(afterMapping[1]).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [["v1","v2"],["v1","v3"]] gdy podamy [["v1","v2"],["v1","v3"]]', function (done) {
				beforeMapping = [["v1","v2"],["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(2);
						expect(afterMapping[1]).to.be.length(2);
						expect(afterMapping[0][0]).to.be.equal("v1");
						expect(afterMapping[0][1]).to.be.equal("v2");
						expect(afterMapping[1][0]).to.be.equal("v1");
						expect(afterMapping[1][1]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić [["v2"],["v3"]] gdy podamy [["v1","v2"],["v1","v3"]] i entryMapSource ma key ["1"]', function (done) {
				beforeMapping = [["v1","v2"],["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(1);
						expect(afterMapping[1]).to.be.length(1);
						expect(afterMapping[0][0]).to.be.equal("v2");
						expect(afterMapping[1][0]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić [["v1","v2"],["v1","v3"]] gdy podamy [["v1","v2"],["v1","v3"]] i entryMapSource ma key ["0","1"]', function (done) {
				beforeMapping = [["v1","v2"],["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["0","1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(2);
						expect(afterMapping[1]).to.be.length(2);
						expect(afterMapping[0][0]).to.be.equal("v1");
						expect(afterMapping[0][1]).to.be.equal("v2");
						expect(afterMapping[1][0]).to.be.equal("v1");
						expect(afterMapping[1][1]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić [["v1","v2"],{k2:"v2",k3:"v1"}] gdy podamy [["v1","v2"],{k2:"v2",k3:"v1"}]', function (done) {
				beforeMapping = [["v1","v2"],{k2:"v2",k3:"v1"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(2);
						expect(afterMapping[0][0]).to.be.equal("v1");
						expect(afterMapping[0][1]).to.be.equal("v2");
						expect(afterMapping[1]).to.include.property("k3","v1");
						expect(afterMapping[1]).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [["v1"],{k3:"v1"}] gdy podamy [["v1","v2"],{k2:"v2",k3:"v1"}] i entryMapSource ma key ["k3","0"]', function (done) {
				beforeMapping = [["v1","v2"],{k2:"v2",k3:"v1"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["k3", "0"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(1);
						expect(afterMapping[0][0]).to.be.equal("v1");
						expect(afterMapping[1]).to.include.property("k3","v1");
						expect(afterMapping[1]).to.not.include.property("k2");
						done();
					});
			});
			it('Powinien zwrócić [{k1:"v1",k2:"v2"}] gdy podamy {k1:"v1",k2:"v2"}', function (done) {
				beforeMapping = {k1:"v1",k2:"v2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping).to.include.all.property("k1","v1");
						expect(afterMapping).to.include.all.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [{k1:"v1"}] gdy podamy {k1:"v1",k2:"v2"} i określimy że entryMapSource ma key ["k1"]', function (done) {
				beforeMapping = {k1:"v1",k2:"v2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["k1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping).to.include.all.property("k1","v1");
						expect(afterMapping).to.not.include.all.property("k2");
						done();
					});
			});
			it('Powinien zwrócić [{k1:"v1"}] gdy podamy {k1:"v1",k2:"v2"} i entryMapSource ma key ["dummyKey"]', function (done) {
				beforeMapping = {k1:"v1",k2:"v2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["dummyKey"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping).to.not.include.all.property("k1");
						expect(afterMapping).to.not.include.all.property("k2");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy ["v1","v2"]', function (done) {
				beforeMapping = ["v1","v2"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping.length).to.be.equal(0);
						done();
					});
			});
			it('Powinien zwrócić [{k1:"v1",k2:"v2"}] gdy podamy ["v1","v2",{k1:"v1",k2:"v2"}]', function (done) {
				beforeMapping = ["v1","v2",{k1:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping).to.include.all.property("k1","v1");
						expect(afterMapping).to.include.all.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [{k1:"v1"}] gdy podamy ["v1","v2",{k1:"v1",k2:"v2"}] i entryMapSource ma key ["k1"]', function (done) {
				beforeMapping = ["v1","v2",{k1:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["k1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping).to.include.all.property("k1","v1");
						expect(afterMapping).to.not.include.all.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy "v1"', function (done) {
				beforeMapping = "v1";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping.length).to.be.equal(0);
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy obiekt new Date', function (done) {
				beforeMapping = new Date();
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping.length).to.be.equal(0);
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy null', function (done) {
				beforeMapping = null;
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping.length).to.be.equal(0);
						done();
					});
			});
		});
		describe("Gdy mamy ustawiony typ mapowania MAP_OBJECT", function () {
			it('Powinien zwrócić {k1:"v1",k2:"v4",k3:"v2"} gdy podamy [{k1:"v1",k2:"v2"},{k3:"v2",k2:"v4"}]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v2",k2:"v4"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.include.property("k2","v4");
						expect(afterMapping).to.include.property("k3","v2");
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1"} gdy podamy [{k1:"v1",k2:"v2"},{k3:"v2",k2:"v4"}] i entryMapSource ma key ["k1"]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v2",k2:"v4"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["k1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.not.include.property("k2");
						expect(afterMapping).to.not.include.property("k3");
						done();
					});
			});
			it('Powinien zwrócić {0:"v1",1:"v3"} gdy podamy [["v1","v2"],["v1","v3"]]', function (done) {
				beforeMapping = [["v1","v2"],["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("0","v1");
						expect(afterMapping).to.include.property("1","v3");
						done();
					});
			});
			it('Powinien zwrócić {0:"v1",1:"v3", k1:"v1"} gdy podamy typ mieszany [["v1","v3"],{k1:"v1"}]', function (done) {
				beforeMapping = [["v1","v3"],{k1:"v1"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("0","v1");
						expect(afterMapping).to.include.property("1","v3");
						expect(afterMapping).to.include.property("k1","v1");
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1",k2:"v4"} gdy podamy {k1:"v1",k2:"v4"}', function (done) {
				beforeMapping = {k1:"v1",k2:"v4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.include.property("k2","v4");
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1"} gdy podamy {k1:"v1",k2:"v4"} i entryMapSource ma key ["k1"]', function (done) {
				beforeMapping = {k1:"v1",k2:"v4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["k1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.not.include.property("k2");
						done();
					});
			});
			it('Powinien zwrócić {} gdy podamy {k1:"v1",k2:"v4"} i entryMapSource ma key ["dummy"]', function (done) {
				beforeMapping = {k1:"v1",k2:"v4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.not.include.property("k1");
						expect(afterMapping).to.not.include.property("k2");
						done();
					});
			});
			it('Powinien zwrócić {} gdy podamy ["v1","v2"] ', function (done) {
				beforeMapping = ["v1","v2"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1",k2:"v2"} gdy podamy ["v1","v2",{k1:"v1",k2:"v2"}]', function (done) {
				beforeMapping = ["v1","v2",{k1:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić {} gdy podamy "v1" ', function (done) {
				beforeMapping = "v1";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić {} gdy podamy new Date() ', function (done) {
				beforeMapping = new Date();
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić {} gdy podamy null ', function (done) {
				beforeMapping = null;
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
		});
		describe("Gdy mamy ustawiony typ mapowania MAP_VALUE_ARRAY", function () {
			it('Powinien zwrócić [] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić ["val5"] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"},"val5"]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"},"val5"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping[0]).to.be.equal("val5");
						done();
					});
			});
			it('Powinien zwrócić ["val5","val6"] gdy podamy ["val5","val6"]', function (done) {
				beforeMapping = ["val5","val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping[0]).to.be.equal("val5");
						expect(afterMapping[1]).to.be.equal("val6");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy ["val5","val6"] i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping = ["val5","val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić ["val1","val2"] gdy podamy {key1:"val1",key2:"val2"}', function (done) {
				beforeMapping = {key1:"val1",key2:"val2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.equal("val1");
						expect(afterMapping[1]).to.be.equal("val2");
						done();
					});
			});
			it('Powinien zwrócić ["val1"] gdy podamy {key1:"val1",key2:"val2"} i entryMapSource ma klucz ["key1"]', function (done) {
				beforeMapping = {key1:"val1",key2:"val2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["key1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping[0]).to.be.equal("val1");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy {key1:"val1",key2:"val2"} i entryMapSource ma klucz ["dummy"]', function (done) {
				beforeMapping = {key1:"val1",key2:"val2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(0);
						done();
					});
			});
			it('Powinien zwrócić ["val1"] gdy podamy "val1"', function (done) {
				beforeMapping = "val1";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping[0]).to.be.equal("val1");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy "val1" i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping = "val1";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(0);
						done();
					});
			});
		});
		describe("Gdy mamy ustawiony typ mapowania MAP_VALUE", function () {
			it('Powinien zwrócić null gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
			it('Powinien zwrócić "val5" gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"},"val5"]', function (done) {
				beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"},"val5"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val5");
						done();
					});
			});
			it('Powinien zwrócić "val6" gdy podamy ["val5","val6"]', function (done) {
				beforeMapping = ["val5","val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val6");
						done();
					});
			});
			it('Powinien zwrócić null gdy podamy ["val5","val6"] i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping = ["val5","val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
			it('Powinien zwrócić "val2" gdy podamy {key1:"val1",key2:"val2"}', function (done) {
				beforeMapping = {key1:"val1",key2:"val2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val2");
						done();
					});
			});
			it('Powinien zwrócić "val1" gdy podamy {key1:"val1",key2:"val2"} i entryMapSource ma klucz ["key1"]', function (done) {
				beforeMapping = {key1:"val1",key2:"val2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["key1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val1");
						done();
					});
			});
			it('Powinien zwrócić null gdy podamy {key1:"val1",key2:"val2"} i entryMapSource ma klucz ["dummy"]', function (done) {
				beforeMapping = {key1:"val1",key2:"val2"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
			it('Powinien zwrócić "val1" gdy podamy "val1"', function (done) {
				beforeMapping = "val1";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val1");
						done();
					});
			});
			it('Powinien zwrócić null gdy podamy "val1" i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping = "val1";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
		});
	});
	describe("Testowanie mapowania danych z dwóch źródeł", function () {
		var myNode2, beforeMapping1, beforeMapping2, afterMapping;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("process");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");

			myModule.addAction(myAction);
			var myProcessModel = new Core.Node.ProcessModel();
			myAction.setActionHandler(myProcessModel.getActionHandler());

			var myNode1a = new Core.Node.BaseNode(myProcessModel);
			myProcessModel.addChildNode(myNode1a);
			myNode1a.setContent(function(processEntryList, request, response, processList) {
				return new Core.Util.Promise(function(resolve){
					resolve(beforeMapping1);
				});
			});
			var myNode1b = new Core.Node.BaseNode(myProcessModel);
			myProcessModel.addChildNode(myNode1b);
			myNode1b.setContent(function(processEntryList, request, response, processList) {
				return new Core.Util.Promise(function(resolve){
					resolve(beforeMapping2);
				});
			});
			myNode2 = new Core.Node.BaseNode(myProcessModel);
			myNode1a.addChildNode(myNode2);
			myNode1b.addChildNode(myNode2);
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
		describe("Gdy mamy ustawiony typ mapowania MAP_OBJECT_ARRAY", function () {
			it('Powinien zwrócić [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v1",k2:"v2"}]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.include.property("k1","v1");
						expect(afterMapping[0]).to.include.property("k2","v2");
						expect(afterMapping[1]).to.include.property("k3","v1");
						expect(afterMapping[1]).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [{k2:"v2"},{k2:"v2"}] gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v1",k2:"v2"}] i entryMapSource ma key ["k2"]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["k2"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.not.include.property("k1");
						expect(afterMapping[0]).to.include.property("k2","v2");
						expect(afterMapping[1]).to.not.include.property("k3");
						expect(afterMapping[1]).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [["v1","v2"],["v1","v3"]] gdy podamy [["v1","v2"]] i [["v1","v3"]]', function (done) {
				beforeMapping1 = [["v1","v2"]];
				beforeMapping2 = [["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(2);
						expect(afterMapping[1]).to.be.length(2);
						expect(afterMapping[0][0]).to.be.equal("v1");
						expect(afterMapping[0][1]).to.be.equal("v2");
						expect(afterMapping[1][0]).to.be.equal("v1");
						expect(afterMapping[1][1]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić [["v2"],["v3"]] gdy podamy [["v1","v2"]] i [["v1","v3"]] i entryMapSource ma key ["1"]', function (done) {
				beforeMapping1 = [["v1","v2"]];
				beforeMapping2 = [["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(1);
						expect(afterMapping[1]).to.be.length(1);
						expect(afterMapping[0][0]).to.be.equal("v2");
						expect(afterMapping[1][0]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić [["v1","v2"],{k2:"v2",k3:"v1"}] gdy podamy [["v1","v2"]] i [{k2:"v2",k3:"v1"}]', function (done) {
				beforeMapping1 = [["v1","v2"]];
				beforeMapping2 = [{k2:"v2",k3:"v1"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.length(2);
						expect(afterMapping[0][0]).to.be.equal("v1");
						expect(afterMapping[0][1]).to.be.equal("v2");
						expect(afterMapping[1]).to.include.property("k3","v1");
						expect(afterMapping[1]).to.include.property("k2","v2");
						done();
					});
			});
			it('Powinien zwrócić [{k1:"v1",k2:"v2"}, {k1:"v1",k3:"v3"}] gdy podamy {k1:"v1",k2:"v2"} i {k1:"v1",k3:"v3"}', function (done) {
				beforeMapping1 = {k1:"v1",k2:"v2"};
				beforeMapping2 = {k1:"v1",k3:"v3"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.include.property("k1","v1");
						expect(afterMapping[0]).to.include.property("k2","v2");
						expect(afterMapping[1]).to.include.property("k1","v1");
						expect(afterMapping[1]).to.include.property("k3","v3");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy ["v1","v2"]i ["v3","v4"]', function (done) {
				beforeMapping1 = ["v1","v2"];
				beforeMapping2 = ["v3","v4"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping.length).to.be.equal(0);
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy "v1" i "v2"', function (done) {
				beforeMapping1 = "v1";
				beforeMapping2 = "v2";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping.length).to.be.equal(0);
						done();
					});
			});
		});
		describe("Gdy mamy ustawiony typ mapowania MAP_OBJECT", function () {
			it('Powinien zwrócić {k1:"v1",k2:"v4",k3:"v2"} gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v2",k2:"v4"}]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v2",k2:"v4"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.include.property("k2","v4");
						expect(afterMapping).to.include.property("k3","v2");
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1"} gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v2",k2:"v4"}] i entryMapSource ma key ["k1"]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v2",k2:"v4"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["k1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.not.include.property("k2");
						expect(afterMapping).to.not.include.property("k3");
						done();
					});
			});
			it('Powinien zwrócić {0:"v1",1:"v3"} gdy podamy [["v1","v2"]] i [["v1","v3"]]', function (done) {
				beforeMapping1 = [["v1","v2"]];
				beforeMapping2 = [["v1","v3"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("0","v1");
						expect(afterMapping).to.include.property("1","v3");
						done();
					});
			});
			it('Powinien zwrócić {0:"v1",1:"v3", k1:"v1"} gdy podamy typ mieszany [["v1","v3"],{k1:"v1"}]', function (done) {
				beforeMapping1 = [["v1","v3"]];
				beforeMapping2 = [{k1:"v1"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("0","v1");
						expect(afterMapping).to.include.property("1","v3");
						expect(afterMapping).to.include.property("k1","v1");
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1",k2:"v4",k3:"v2"} gdy podamy {k1:"v1",k2:"v2"} i {k3:"v2",k2:"v4"}', function (done) {
				beforeMapping1 = {k1:"v1",k2:"v2"};
				beforeMapping2 = {k3:"v2",k2:"v4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.include.property("k2","v4");
						expect(afterMapping).to.include.property("k3","v2");
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1"} gdy podamy {k1:"v1",k2:"v2"} i {k3:"v2",k2:"v4"} i entryMapSource ma key ["k1"]', function (done) {
				beforeMapping1 = {k1:"v1",k2:"v2"};
				beforeMapping2 = {k3:"v2",k2:"v4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["k1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.not.include.property("k2");
						expect(afterMapping).to.not.include.property("k3");
						done();
					});
			});
			it('Powinien zwrócić {} gdy podamy ["v1"] i ["v2"] ', function (done) {
				beforeMapping1 = ["v1"];
				beforeMapping2 = ["v2"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić {k1:"v1",k2:"v2","0":"v2","1":"v4"} gdy podamy {k1:"v1",k2:"v2"} i [["v2","v4"]]', function (done) {
				beforeMapping1 = {k1:"v1",k2:"v2"};
				beforeMapping2 = [["v2","v4"]];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.include.property("k1","v1");
						expect(afterMapping).to.include.property("k2","v2");
						expect(afterMapping).to.include.property("0","v2");
						expect(afterMapping).to.include.property("1","v4");
						done();
					});
			});
		});
		describe("Gdy mamy ustawiony typ mapowania MAP_VALUE_ARRAY", function () {
			it('Powinien zwrócić [] gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v1",k2:"v2"}]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić ["val5"] gdy podamy [{k1:"v1",k2:"v2"}] i {k3:"v1",k2:"v2"},"val5"]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v1",k2:"v2"},"val5"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping[0]).to.be.equal("val5");
						done();
					});
			});
			it('Powinien zwrócić ["v1","v2","v3"] gdy podamy ["v1"] i {k1:"v2",k2:"v3"}', function (done) {
				beforeMapping1 = ["v1"];
				beforeMapping2 = {k1:"v2",k2:"v3"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(3);
						expect(afterMapping[0]).to.be.equal("v1");
						expect(afterMapping[1]).to.be.equal("v2");
						expect(afterMapping[2]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić ["v3"] gdy podamy ["v1"] i {k1:"v2",k2:"v3"} i entryMapSource ma klucz ["k2"]', function (done) {
				beforeMapping1 = ["v1"];
				beforeMapping2 = {k1:"v2",k2:"v3"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["k2"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(1);
						expect(afterMapping[0]).to.be.equal("v3");
						done();
					});
			});
			it('Powinien zwrócić ["val5","val6"] gdy podamy ["val5"] i ["val6"]', function (done) {
				beforeMapping1 = ["val5"];
				beforeMapping2 = ["val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping[0]).to.be.equal("val5");
						expect(afterMapping[1]).to.be.equal("val6");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy ["val5"] i ["val6"] i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping1 = ["val5"];
				beforeMapping2 = ["val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.empty;
						done();
					});
			});
			it('Powinien zwrócić ["val1","val2","val3","val4"] gdy podamy {key1:"val1",key2:"val2"} i {key1:"val3",key2:"val4"}', function (done) {
				beforeMapping1 = {key1:"val1",key2:"val2"};
				beforeMapping2 = {key1:"val3",key2:"val4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(4);
						expect(afterMapping[0]).to.be.equal("val1");
						expect(afterMapping[1]).to.be.equal("val2");
						expect(afterMapping[2]).to.be.equal("val3");
						expect(afterMapping[3]).to.be.equal("val4");
						done();
					});
			});
			it('Powinien zwrócić ["val1","val4"] gdy podamy {key1:"val1",key2:"val2"} i {key1:"val4",key2:"val3"} i entryMapSource ma klucz ["key1"]', function (done) {
				beforeMapping1 = {key1:"val1",key2:"val2"};
				beforeMapping2 = {key1:"val4",key2:"val3"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["key1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.equal("val1");
						expect(afterMapping[1]).to.be.equal("val4");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy {key1:"val1",key2:"val2"} i {key1:"val5",key2:"val3"} i entryMapSource ma klucz ["dummy"]', function (done) {
				beforeMapping1 = {key1:"val1",key2:"val2"};
				beforeMapping2 = {key1:"val5",key2:"val3"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(0);
						done();
					});
			});
			it('Powinien zwrócić ["val1", "val2"] gdy podamy "val1"i "val2"', function (done) {
				beforeMapping1 = "val1";
				beforeMapping2 = "val2";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(2);
						expect(afterMapping[0]).to.be.equal("val1");
						expect(afterMapping[1]).to.be.equal("val2");
						done();
					});
			});
			it('Powinien zwrócić [] gdy podamy "val1" i "val2" i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping1 = "val1";
				beforeMapping2 = "val2";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.length(0);
						done();
					});
			});
		});
		describe("Gdy mamy ustawiony typ mapowania MAP_VALUE", function () {
			it('Powinien zwrócić null gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v1",k2:"v2"}]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v1",k2:"v2"}];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
			it('Powinien zwrócić "val5" gdy podamy [{k1:"v1",k2:"v2"}] i [{k3:"v1",k2:"v2"},"val5"]', function (done) {
				beforeMapping1 = [{k1:"v1",k2:"v2"}];
				beforeMapping2 = [{k3:"v1",k2:"v2"},"val5"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val5");
						done();
					});
			});
			it('Powinien zwrócić "val6" gdy podamy ["val5"] i ["val6"]', function (done) {
				beforeMapping1 = ["val5"];
				beforeMapping2 = ["val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val6");
						done();
					});
			});
			it('Powinien zwrócić null gdy podamy ["val5"] i ["val6"] i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping1 = ["val5"];
				beforeMapping2 = ["val6"];
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE, ["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
			it('Powinien zwrócić "val4" gdy podamy {key1:"val1",key2:"val2"} i {key1:"val3",key2:"val4"}', function (done) {
				beforeMapping1 = {key1:"val1",key2:"val2"};
				beforeMapping2 = {key1:"val3",key2:"val4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val4");
						done();
					});
			});
			it('Powinien zwrócić "val3" gdy podamy {key1:"val1",key2:"val2"} {key1:"val3",key2:"val4"} i entryMapSource ma klucz ["key1"]', function (done) {
				beforeMapping1 = {key1:"val1",key2:"val2"};
				beforeMapping2 = {key1:"val3",key2:"val4"};
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["key1"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val3");
						done();
					});
			});
			it('Powinien zwrócić "val2" gdy podamy "val1" i "val2"', function (done) {
				beforeMapping1 = "val1";
				beforeMapping2 = "val2";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.equal("val2");
						done();
					});
			});
			it('Powinien zwrócić null gdy podamy "val1" i "val2" i entryMapSource ma jakikolwiek klucz', function (done) {
				beforeMapping1 = "val1";
				beforeMapping2 = "val2";
				myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
				myNode2.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE,["dummy"]);
				request(app).get("/process/myAction")
					.end(function (err, res) {
						expect(afterMapping).to.be.null;
						done();
					});
			});
		});
	});
});