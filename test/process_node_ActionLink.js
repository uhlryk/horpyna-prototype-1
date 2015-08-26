var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.ActionLink", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping, testAction1, testAction2;
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
		testNode = new Core.Node.Transform.ActionLink(myProcessModel);
		myNode1.addChildNode(testNode);

		myNode2 = new Core.Node.BaseNode(myProcessModel);
		testNode.addChildNode(myNode2);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				afterMapping = myNode2.getEntryMappedByType(processEntryList, request);
				resolve(null);
			});
		});
		testAction1 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "testAction1");
		myModule.addAction(testAction1);
		var p1 = new Core.Field("p1", Core.Action.FieldType.PARAM_FIELD);
		var p2 = new Core.Field("p2", Core.Action.FieldType.PARAM_FIELD);
		testAction1.addField(p1);
		testAction1.addField(p2);
		var q1 = new Core.Field("q1", Core.Action.FieldType.QUERY_FIELD);
		var q2 = new Core.Field("q2", Core.Action.FieldType.QUERY_FIELD);
		testAction1.addField(q1);
		testAction1.addField(q2);

		testAction2 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "testAction2");
		var p1 = new Core.Field("p1", Core.Action.FieldType.PARAM_FIELD);
		var p3 = new Core.Field("p3", Core.Action.FieldType.PARAM_FIELD);
		testAction2.addField(p1);
		testAction2.addField(p3);
		var q1 = new Core.Field("q1", Core.Action.FieldType.QUERY_FIELD);
		var q3 = new Core.Field("q3", Core.Action.FieldType.QUERY_FIELD);
		testAction2.addField(q1);
		testAction2.addField(q3);

		myModule.addAction(testAction2);
		myApp.init().then(function () {
			done();
		});
	});
	/**
	 * Zwróci jeden link ponieważ dla null mapowanie zwróci obiekt pusty {}
	 * A obiekt pusty może utworzyć link, tylko parametry nieznane będą wynosiły 0
	 */
	it('Powinien zwrócić [{uri:"/process/testAction1/0/0",name:"testAction1"}] gdy podamy null i testAction1 dla mapowania MAP_OBJECT', function (done) {
		beforeMapping = null;
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		testNode.addAction(testAction1);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/0/0");
				expect(afterMapping[0]).to.include.property("name","testAction1");
				done();
			});
	});
	/**
	 * Ponieważ mapowanie dla null zwróci []. A więc Node uzna że brak jest obiektów, a liczba zwróconych linków
	 * to liczba akcji * liczba obiektów
	 */
	it('Powinien zwrócić [] gdy podamy null i testAction1 dla mapowania MAP_OBJECT_ARRAY', function (done) {
		beforeMapping = null;
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.addAction(testAction1);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.empty;
				done();
			});
	});
	it('Powinien zwrócić [{uri:"/process/testAction1/1/2",name:"dummy"}] gdy podamy {p1:1,p2:2,n:"dummy"} i testAction1 i name from source key "n"', function (done) {
		beforeMapping = {p1:1,p2:2,n:"dummy"};
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		testNode.addAction(testAction1);
		testNode.setNameFromEntrySource("n");
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2");
				expect(afterMapping[0]).to.include.property("name","dummy");
				done();
			});
	});
/**
 * Przy mapowaniu na obiekt, dane wejściowe zostaną zamienione na jeden obiekt, a więc tworzymy link dla jednej akcji i jednego obiektu
 * dlatego mapować musimy na listę
 */
	it('Powinien zwrócić listę z dwoma obiektami linków gdy podamy tablicę z dwoma obiektami danych i akcję testAction1 mapowanie musi być na MAP_OBJECT_ARRAY', function (done) {
		beforeMapping = [{p1:1,p2:2,q1:3,q2:4,n:"dummy"},{p1:"a",p2:"b",q1:"c",q2:"d",n:"foo"}];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.addAction(testAction1);
		testNode.setNameFromEntrySource("n");
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2?q1=3&q2=4");
				expect(afterMapping[0]).to.include.property("name","dummy");
				expect(afterMapping[1]).to.include.property("uri","/process/testAction1/a/b?q1=c&q2=d");
				expect(afterMapping[1]).to.include.property("name","foo");
				done();
			});
	});
	it('Powinien zwrócić listę z dwoma obiektami linków gdy podamy jeden obiekt danych i dwie akcje testAction1,testAction2', function (done) {
		beforeMapping = {p1:1,p2:2,q1:3,q2:4};
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		testNode.addAction(testAction1);
		testNode.addAction(testAction2);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2?q1=3&q2=4");
				expect(afterMapping[0]).to.include.property("name","testAction1");
				expect(afterMapping[1]).to.include.property("uri","/process/testAction2/1/0?q1=3");
				expect(afterMapping[1]).to.include.property("name","testAction2");
				done();
			});
	});
	/**
	 * Przy mapowaniu na obiekt, dane wejściowe zostaną zamienione na jeden obiekt, a więc tworzymy link dla jednej akcji i jednego obiektu
	 * dlatego mapować musimy na listę
	 * MAP_OBJECT_ARRAY
	 */
	it('Powinien zwrócić listę z czterema obiektami linków gdy podamy tablicę z dwoma obiektami danych i dwie akcje testAction1,testAction2', function (done) {
		beforeMapping = [{p1:1,p2:2,q1:3,q2:4,n:"dummy"},{p1:"a",p2:"b",q1:"c",q2:"d",n:"foo"}];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.addAction(testAction1);
		testNode.addAction(testAction2);
		testNode.setNameFromEntrySource("n");
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2?q1=3&q2=4");
				expect(afterMapping[0]).to.include.property("name","dummy");
				expect(afterMapping[1]).to.include.property("uri","/process/testAction2/1/0?q1=3");
				expect(afterMapping[1]).to.include.property("name","dummy");
				expect(afterMapping[2]).to.include.property("uri","/process/testAction1/a/b?q1=c&q2=d");
				expect(afterMapping[2]).to.include.property("name","foo");
				expect(afterMapping[3]).to.include.property("uri","/process/testAction2/a/0?q1=c");
				expect(afterMapping[3]).to.include.property("name","foo");
				done();
			});
	});
});