var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.ActionLink", function() {
	var myProcessModel, myNode2, myNode1, beforeMapping1, beforeMapping2, afterMapping, testAction1, testAction2;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");
		myModule.addAction(myAction);

		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());

		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping1);
			});
		});
		myNode2 = new Core.Node.BaseNode([myProcessModel]);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping2);
			});
		});



		myApp.init().then(function () {
			done();
		});
	});
	/**
	 * Ponieważ mapowanie dla null zwróci []. A więc Node uzna że brak jest obiektów, a liczba zwróconych linków
	 * to liczba akcji * liczba obiektów lub przy braku obiektów liczba akcji * 1
	 */
	it('Powinien zwrócić [] gdy podamy null i testAction1', function (done) {
		beforeMapping = null;
		testNode.addAction(testAction1);

		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				afterMapping = myNode2.getMappedEntry(processEntryList, request);
				resolve(null);
			});
		});
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/0/0");
				expect(afterMapping[0]).to.include.property("name","testAction1");
				done();
			});
	});

});