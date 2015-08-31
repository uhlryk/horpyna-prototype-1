var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.Pagination", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping, myAction;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");
		myModule.addAction(myAction);
		var q1 = new Core.Field("test", Core.Action.FieldType.QUERY_FIELD, {optional:true});
		myAction.addField(q1);
		var q2 = new Core.Field("p", Core.Action.FieldType.QUERY_FIELD, {optional:true});
		myAction.addField(q2);
		var q3 = new Core.Field("s", Core.Action.FieldType.QUERY_FIELD, {optional:true});
		myAction.addField(q3);
		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());

		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(data) {
			return beforeMapping;
		});
		testNode = new Core.App.Node.Pagination([myNode1]);
		testNode.setPage(Core.Node.NodeMapper.RESPONSE_NODE, "page");
		testNode.setSize(Core.Node.NodeMapper.RESPONSE_NODE, "size");
		testNode.setAllSize(Core.Node.NodeMapper.RESPONSE_NODE, "allSize");
		testNode.setAction(myAction);

		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
			afterMapping = data.getMappedEntry();
			return null;
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien zwrócić pustą listę linków gdy wszystkie linki mieszczą się na pierwszej stronie', function (done) {
		beforeMapping = [{page:0, size:5, allSize:5}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(0);
				done();
			});
	});
	it('Powinien zwrócić link "2" i next gdy jesteśmy na pierwszej stronie i mamy dwie strony', function (done) {
		beforeMapping = [{page:0, size:5, allSize:6}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.to.include.property("uri","/process/myAction?p=1&s=5");
				expect(afterMapping[0]).to.to.include.property("name",2);
				expect(afterMapping[0]).to.to.include.property("type","num");
				expect(afterMapping[1]).to.to.include.property("uri","/process/myAction?p=1&s=5");
				expect(afterMapping[1]).to.to.include.property("name","next");
				expect(afterMapping[1]).to.to.include.property("type","next");
				done();
			});
	});
	it('Powinien zwrócić link "1" i previous i first gdy jesteśmy na drugiej stronie i mamy dwie strony', function (done) {
		beforeMapping = [{page:1, size:5, allSize:6}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.to.include.property("uri","/process/myAction?p=0&s=5");
				expect(afterMapping[0]).to.to.include.property("name","first");
				expect(afterMapping[0]).to.to.include.property("type","first");

				expect(afterMapping[1]).to.to.include.property("uri","/process/myAction?p=0&s=5");
				expect(afterMapping[1]).to.to.include.property("name","previous");
				expect(afterMapping[1]).to.to.include.property("type","previous");

				expect(afterMapping[2]).to.to.include.property("uri","/process/myAction?p=0&s=5");
				expect(afterMapping[2]).to.to.include.property("name",1);
				expect(afterMapping[2]).to.to.include.property("type","num");
				done();
			});
	});
	it('Powinien zwrócić link "1" i previous i first i next gdy jesteśmy na drugiej stronie i mamy trzy strony', function (done) {
		beforeMapping = [{page:1, size:5, allSize:11}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(5);
				expect(afterMapping[0]).to.to.include.property("uri","/process/myAction?p=0&s=5");
				expect(afterMapping[0]).to.to.include.property("name","first");
				expect(afterMapping[0]).to.to.include.property("type","first");

				expect(afterMapping[1]).to.to.include.property("uri","/process/myAction?p=0&s=5");
				expect(afterMapping[1]).to.to.include.property("name","previous");
				expect(afterMapping[1]).to.to.include.property("type","previous");

				expect(afterMapping[2]).to.to.include.property("uri","/process/myAction?p=0&s=5");
				expect(afterMapping[2]).to.to.include.property("name",1);
				expect(afterMapping[2]).to.to.include.property("type","num");

				expect(afterMapping[3]).to.to.include.property("uri","/process/myAction?p=2&s=5");
				expect(afterMapping[3]).to.to.include.property("name",3);
				expect(afterMapping[3]).to.to.include.property("type","num");

				expect(afterMapping[4]).to.to.include.property("uri","/process/myAction?p=2&s=5");
				expect(afterMapping[4]).to.to.include.property("name","next");
				expect(afterMapping[4]).to.to.include.property("type","next");
				done();
			});
	});
});