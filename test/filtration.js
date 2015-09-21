var express = require('express');
var chai = require("chai");
var morgan = require("morgan");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Filtracja", function() {
	describe("filtracja BaseFilter", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			filter = new Core.Field.BaseFilter(myField1, "filter1", false);
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca tą samą wartość ponieważ filtr nie robił na niej operacji'", function (done) {
			request(app).post("/mod1/act1/")
				.send({param1: "olek"})
				.end(function (err, res) {
					expect(finalValue).to.be.equal("olek");
					done();
				});
		});
		it("zwraca wartość z suffixem 'BBB' bo takie coś robił filtr", function (done) {
			filter.setLogic(function(value){
				return value+"BBB";
			});
			request(app).post("/mod1/act1/")
			.send({param1: "olek"})
				.end(function (err, res) {
					expect(finalValue).to.be.equal("olekBBB");
					done();
				});
		});
		it("zwraca wwartość pustą ponieważ do filtra nic nie zostało przekazane'", function (done) {
			myField1.optional = true;
			request(app).post("/mod1/act1/")
				.end(function (err, res) {
					expect(finalValue).to.be.null;
					done();
				});
		});
	});
	describe("filtracja z dwoma BaseFilter", function () {
		var myField1, finalValue, filter1, filter2;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			filter1 = new Core.Field.BaseFilter(myField1, "filter1", false);
			filter2 = new Core.Field.BaseFilter(myField1, "filter2", false);
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca wartość z sufixem 'BBBAAA' ponieważ działają dwa filtry gdzie pierwszy daje sufix BBB a następny AAA", function (done) {
			filter1.setLogic(function(value){
				return value+"BBB";
			});
			filter2.setLogic(function(value){
				return value+"AAA";
			});
			request(app).post("/mod1/act1/")
			.send({param1: "olek"})
				.end(function (err, res) {
					expect(finalValue).to.be.equal("olekBBBAAA");
					done();
				});
		});
	});
	describe("filtracja Blacklist", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 'olek' gdy przekażemy 'olek' i nic nie mamy na czarnej liście", function (done) {
			filter = new Core.Field.FilterStandard.Blacklist(myField1, "filter1", "");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olek"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek");
						done();
					});
			});
		});
		it("zwraca 'olek' gdy przekażemy 'olek1' i mamy na czarnej liście '1'", function (done) {
			filter = new Core.Field.FilterStandard.Blacklist(myField1, "filter1", "1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olek1"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek");
						done();
					});
			});
		});
		it("zwraca 'olek' gdy przekażemy 'ol12ek1' i mamy na czarnej liście '12' - każdy znak osobno sprawdzany", function (done) {
			filter = new Core.Field.FilterStandard.Blacklist(myField1, "filter1", "12");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "ol12ek1"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek");
						done();
					});
			});
		});
		it("zwraca 'olek' gdy przekażemy 'olążźćŃ™€ßį§¶•Ľ[]ek' i mamy na czarnej liście 'ążźćŃ™€ßį§¶•Ľ[]'", function (done) {
			filter = new Core.Field.FilterStandard.Blacklist(myField1, "filter1", "ążźćŃ™€ßį§¶•Ľ\\[\\]");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olążźćŃ™€ßį§¶•Ľ[]ek"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek");
						done();
					});
			});
		});
	});
	describe("filtracja Whitelist", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 'olek' gdy przekażemy 'olek' i nic nie mamy na czarnej liście", function (done) {
			filter = new Core.Field.FilterStandard.Whitelist(myField1, "filter1", "kelo");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olek"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek");
						done();
					});
			});
		});
		it("zwraca 'k1' gdy przekażemy 'olek1' i mamy na czarnej liście 'k1'", function (done) {
			filter = new Core.Field.FilterStandard.Whitelist(myField1, "filter1", "k1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olek1"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("k1");
						done();
					});
			});
		});
		it("zwraca '121' gdy przekażemy 'ol12ek1' i mamy na czarnej liście '12' - każdy znak osobno sprawdzany", function (done) {
			filter = new Core.Field.FilterStandard.Whitelist(myField1, "filter1", "12");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "ol12ek1"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("121");
						done();
					});
			});
		});
		it("zwraca 'ążź[]' gdy przekażemy 'olążźćŃ™€ßį§¶•Ľ[]ek' i mamy na czarnej liście 'ążźćŃ™€ßį§¶•Ľ[]'", function (done) {
			filter = new Core.Field.FilterStandard.Whitelist(myField1, "filter1", "ążź\\[\\]");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olążźćŃ™€ßį§¶•Ľ[]ek"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("ążź[]");
						done();
					});
			});
		});
	});
	describe("filtracja Escape", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 'olek' gdy przekażemy 'olek'", function (done) {
			filter = new Core.Field.FilterStandard.Escape(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olek"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek");
						done();
					});
			});
		});
		it("zwraca 'olek' gdy przekażemy 'olek<>&'", function (done) {
			filter = new Core.Field.FilterStandard.Escape(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "olek<>&"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("olek&lt;&gt;&amp;");
						done();
					});
			});
		});
	});
	describe("filtracja LeftTrim", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 'bca' gdy przekażemy 'aabca' i trim char - 'a'", function (done) {
			filter = new Core.Field.FilterStandard.LeftTrim(myField1, "filter1","a");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "aabca"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("bca");
						done();
					});
			});
		});
		it("zwraca 'abc ' gdy przekażemy '  abc '", function (done) {
			filter = new Core.Field.FilterStandard.LeftTrim(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "  abc "})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("abc ");
						done();
					});
			});
		});
	});
	describe("filtracja RightTrim", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 'abc' gdy przekażemy 'abcaa' i trim char - 'a'", function (done) {
			filter = new Core.Field.FilterStandard.RightTrim(myField1, "filter1","a");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "abcaa"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("abc");
						done();
					});
			});
		});
		it("zwraca ' abc' gdy przekażemy ' abc  '", function (done) {
			filter = new Core.Field.FilterStandard.RightTrim(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: " abc  "})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(" abc");
						done();
					});
			});
		});
	});
	describe("filtracja Trim", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 'bc' gdy przekażemy 'abcaa' i trim char - 'a'", function (done) {
			filter = new Core.Field.FilterStandard.Trim(myField1, "filter1","a");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "abcaa"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("bc");
						done();
					});
			});
		});
		it("zwraca 'abc' gdy przekażemy ' abc  '", function (done) {
			filter = new Core.Field.FilterStandard.Trim(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "abc"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("abc");
						done();
					});
			});
		});
	});
	describe("filtracja ToBoolean", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca true gdy przekażemy 'cos'", function (done) {
			filter = new Core.Field.FilterStandard.ToBoolean(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "cos"})
					.end(function (err, res) {
						expect(finalValue).to.be.true;
						done();
					});
			});
		});
		it("zwraca false gdy przekazemy 'false'", function (done) {
			filter = new Core.Field.FilterStandard.ToBoolean(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "false"})
					.end(function (err, res) {
						expect(finalValue).to.be.false;
						done();
					});
			});
		});
		it("zwraca false gdy przekazemy ''", function (done) {
			filter = new Core.Field.FilterStandard.ToBoolean(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: ""})
					.end(function (err, res) {
						expect(finalValue).to.be.false;
						done();
					});
			});
		});
		it("zwraca false gdy przekazemy '0'", function (done) {
			filter = new Core.Field.FilterStandard.ToBoolean(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "0"})
					.end(function (err, res) {
						expect(finalValue).to.be.false;
						done();
					});
			});
		});
	});
	describe("filtracja ToDate", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca null gdy przekażemy 'notdate'", function (done) {
			filter = new Core.Field.FilterStandard.ToDate(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "notdate"})
					.end(function (err, res) {
						expect(finalValue).to.be.null;
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca datę gdy przekazemy 'March 21, 2012'", function (done) {
			filter = new Core.Field.FilterStandard.ToDate(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "March 21, 2012"})
					.end(function (err, res) {
						expect(finalValue).to.be.date;
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca datę gdy przekazemy 'Marzec 21, 2012'", function (done) {
			filter = new Core.Field.FilterStandard.ToDate(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "Marzec 21, 2012"})
					.end(function (err, res) {
						expect(finalValue).to.be.date;
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca datę gdy przekazemy '1995-12-17'", function (done) {
			filter = new Core.Field.FilterStandard.ToDate(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "1995-12-17"})
					.end(function (err, res) {
						expect(finalValue).to.be.date;
						console.log(finalValue);
						done();
					});
			});
		});
	});
	describe("filtracja ToFloat", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 0 gdy przekażemy 'notnumber'", function (done) {
			filter = new Core.Field.FilterStandard.ToFloat(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "notnumber"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(0);
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca liczbę gdy przekazemy '22.12'", function (done) {
			filter = new Core.Field.FilterStandard.ToFloat(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "22.12"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(22.12);
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca 22 gdy przekazemy '22,12'", function (done) {
			filter = new Core.Field.FilterStandard.ToFloat(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "22,12"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(22);
						console.log(finalValue);
						done();
					});
			});
		});
	});
	describe("filtracja ToInt", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 0 gdy przekażemy 'notnumber'", function (done) {
			filter = new Core.Field.FilterStandard.ToInt(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "notnumber"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(0);
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca liczbę 22 gdy przekazemy '22.12'", function (done) {
			filter = new Core.Field.FilterStandard.ToInt(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "22.12"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(22);
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca 0xa gdy przekazemy 'a'", function (done) {
			filter = new Core.Field.FilterStandard.ToInt(myField1, "filter1",16);
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "a"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal(0xa);
						console.log(finalValue);
						done();
					});
			});
		});
	});
	describe("filtracja ToString", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			done();
		});
		it("zwraca 0 gdy przekażemy 'notnumber'", function (done) {
			filter = new Core.Field.FilterStandard.ToString(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: "notnumber"})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("notnumber");
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca liczbę 22 gdy przekazemy '22.12'", function (done) {
			filter = new Core.Field.FilterStandard.ToString(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: 22.12})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("22.12");
						console.log(finalValue);
						done();
					});
			});
		});
		it("zwraca 0xa gdy przekazemy 'a'", function (done) {
			filter = new Core.Field.FilterStandard.ToString(myField1, "filter1");
			myApp.init().then(function () {
				request(app).post("/mod1/act1/")
					.send({param1: true})
					.end(function (err, res) {
						expect(finalValue).to.be.equal("true");
						done();
					});
			});
		});
	});
});